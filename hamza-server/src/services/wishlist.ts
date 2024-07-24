import { TransactionBaseService } from '@medusajs/medusa/dist/interfaces';
import { Customer, CustomerService, Logger } from '@medusajs/medusa';
import { MedusaError } from 'medusa-core-utils';
import { Lifetime } from 'awilix';
import { WishlistItem } from '../models/wishlist-item';
import { Wishlist } from '../models/wishlist';

class WishlistService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly logger: Logger;
    protected readonly customerService: CustomerService;

    constructor(container) {
        super(container);
        this.logger = container.logger;
        this.customerService = container.customerService;
    }

    async create(customer_id) {
        return await this.atomicPhase_(async (transactionManager) => {
            if (!customer_id) {
                throw new MedusaError(
                    MedusaError.Types.INVALID_DATA,
                    `A customer_id must be provided when creating a wishlist`
                );
            }

            const wishlistRepository =
                this.activeManager_.getRepository(Wishlist);

            // Check if a wishlist-dropdown already exists for the customer_id
            const existingWishlist = await wishlistRepository.findOne({
                where: {
                    customer_id: customer_id,
                },
            });

            if (existingWishlist) {
                // Wishlist already exists, return it
                this.logger.debug('Wishlist already exists for this customer');
                return existingWishlist;
            }

            const payload = {
                customer_id,
            };

            //check for existing customer
            if (await this.customerExists(customer_id)) {
                const createdWishlist = wishlistRepository.create(payload);
                const savedWishList =
                    await wishlistRepository.save(createdWishlist);

                const [wishlist] = await wishlistRepository.find({
                    where: { id: savedWishList.id },
                    relations: ['items', 'items.product'],
                });

                return wishlist;
            }

            return null;
        });
    }

    async retrieve(customer_id) {
        const wishlistRepository = this.activeManager_.getRepository(Wishlist);
        return await this.atomicPhase_(async (transactionManager) => {
            const [wishlist] = await wishlistRepository.find({
                where: { customer_id },
                relations: ['items', 'items.product'],
            });

            if (!wishlist) {
                try {
                    const newWishlist = await this.create(customer_id);
                    return newWishlist;
                } catch (e: any) {
                    throw new MedusaError(
                        MedusaError.Types.NOT_FOUND,
                        `Wishlist with customer_id ${customer_id} was not found`
                    );
                }
            }
            return wishlist;
        });
    }

    async addWishItem(customer_id, product_id) {
        const wishlistItemRepository =
            this.activeManager_.getRepository(WishlistItem);
        const wishlistRepository = this.activeManager_.getRepository(Wishlist);
        return await this.atomicPhase_(async (transactionManager) => {
            // Find the wishlist-dropdown based on the customer_id
            const wishlist = await wishlistRepository.findOne({
                where: { customer_id },
            });

            if (!wishlist) {
                throw new MedusaError(
                    MedusaError.Types.NOT_FOUND,
                    `Wishlist not found for customer with ID ${customer_id}`
                );
            }

            // Check if the item already exists in the wishlist-dropdown
            const [item] = await wishlistItemRepository.find({
                where: { wishlist_id: wishlist.id, product_id },
            });

            if (!item) {
                // Create a new wishlist-dropdown item if it doesn't already exist
                const createdItem = wishlistItemRepository.create({
                    wishlist_id: wishlist.id,
                    product_id,
                });
                await wishlistItemRepository.save(createdItem);
            }

            // Fetch the updated wishlist-dropdown with items
            const updatedWishlist = await wishlistRepository.findOne({
                where: { id: wishlist.id },
                relations: ['items', 'items.product'],
            });

            return updatedWishlist;
        });
    }

    async removeWishItem(customer_id, product_id) {
        const wishlistItemRepository =
            this.activeManager_.getRepository(WishlistItem);
        const wishlistRepository = this.activeManager_.getRepository(Wishlist);
        return await this.atomicPhase_(async (transactionManager) => {
            // Find the wishlist-dropdown based on the customer_id
            const wishlist = await wishlistRepository.findOne({
                where: { customer_id },
            });

            if (!wishlist) {
                throw new MedusaError(
                    MedusaError.Types.NOT_FOUND,
                    `Wishlist not found for customer with ID ${customer_id}`
                );
            }
            // Find the wishlist-dropdown item based on the wishlist_id and product_id
            const item = await wishlistItemRepository.findOne({
                where: { wishlist_id: wishlist.id, product_id },
            });

            if (!item) {
                throw new MedusaError(
                    MedusaError.Types.NOT_FOUND,
                    `Item not found in wishlist for customer with ID ${customer_id}`
                );
            }

            // Remove the item from the wishlist-dropdown
            await wishlistItemRepository.remove(item);

            // Fetch the updated wishlist-dropdown with items
            const updatedWishlist = await wishlistRepository.findOne({
                where: { id: wishlist.id },
                relations: ['items', 'items.product'],
            });

            return updatedWishlist;
        });
    }

    private async customerExists(customerId: string): Promise<boolean> {
        try {
            const customer = await this.customerService.retrieve(customerId);
            return customer ? true : false;
        } catch (e: any) {
            return false;
        }
    }
}

export default WishlistService;
