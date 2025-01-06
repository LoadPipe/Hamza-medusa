import {
    ProductVariantService as MedusaProductVariantService,
    Logger,
} from '@medusajs/medusa';
import { ProductVariant } from '@medusajs/medusa';
import { Lifetime } from 'awilix';
import { ProductVariantRepository } from '../repositories/product-variant';
import { createLogger, ILogger } from '../utils/logging/logger';

class ProductVariantService extends MedusaProductVariantService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;
    protected readonly logger: ILogger;

    constructor(container) {
        super(container);
        this.productVariantRepository_ = container.productVariantRepository;
        this.logger = createLogger(container, 'ProductVariantService');
    }

    async checkInventory(variantId: string) {
        try {
            const productVariant = await this.productVariantRepository_.findOne(
                {
                    where: { id: variantId },
                }
            );
            this.logger.debug(
                `Inventory for variant ${productVariant.id}: ${productVariant.inventory_quantity}`
            );
            return productVariant.inventory_quantity;
        } catch (e) {
            this.logger.error(
                `Error checking inventory for variant ${variantId}: ${e}`
            );
        }
    }

    async updateInventory(
        variantOrVariantId: string,
        quantityToDeduct: number
    ) {
        try {
            const productVariant = await this.productVariantRepository_.findOne(
                {
                    where: { id: variantOrVariantId },
                }
            );

            if (productVariant.inventory_quantity >= quantityToDeduct) {
                productVariant.inventory_quantity -= quantityToDeduct;
                await this.productVariantRepository_.save(productVariant);
                this.logger.debug(
                    `Inventory updated for variant ${productVariant.id}, new inventory count: ${productVariant.inventory_quantity}`
                );
                return productVariant;
            } else if (productVariant.allow_backorder) {
                this.logger.info(
                    'Inventory below requested deduction but backorders are allowed.'
                );
            } else {
                this.logger.info(
                    'Not enough inventory to deduct the requested quantity.'
                );
            }
        } catch (e) {
            this.logger.error(
                `Error updating inventory for variant ${variantOrVariantId}: ${e}`
            );
        }
    }

    async getVariantBySku(sku: string): Promise<ProductVariant | null> {
        try {
            const productVariant = await this.productVariantRepository_.findOne(
                {
                    where: { sku: sku },
                }
            );

            return productVariant || null;
        } catch (error) {
            this.logger.error('Error fetching product variant by sku:', error);
            throw new Error('Failed to fetch product variant by sku.');
        }
    }

    async getVariantByBarcode(barcode: string): Promise<ProductVariant | null> {
        try {
            const productVariant = await this.productVariantRepository_.findOne(
                {
                    where: { barcode: barcode },
                }
            );

            return productVariant || null;
        } catch (error) {
            this.logger.error(
                'Error fetching product variant by barcode:',
                error
            );
            throw new Error('Failed to fetch product variant by barcode.');
        }
    }

    async getVariantByUpc(upc: string): Promise<ProductVariant | null> {
        try {
            const productVariant = await this.productVariantRepository_.findOne(
                {
                    where: { upc: upc },
                }
            );

            return productVariant || null;
        } catch (error) {
            this.logger.error('Error fetching product variant by upc:', error);
            throw new Error('Failed to fetch product variant by upc.');
        }
    }

    async getVariantByEan(ean: string): Promise<ProductVariant | null> {
        try {
            const productVariant = await this.productVariantRepository_.findOne(
                {
                    where: { ean: ean },
                }
            );

            return productVariant || null;
        } catch (error) {
            this.logger.error('Error fetching product variant by ean:', error);
            throw new Error('Failed to fetch product variant by ean.');
        }
    }
}

export default ProductVariantService;
