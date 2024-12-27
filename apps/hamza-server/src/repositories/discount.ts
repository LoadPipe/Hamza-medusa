import { Discount } from "../models/discount";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { DiscountRepository as MedusaDiscountRepository } from "@medusajs/medusa/dist/repositories/discount";

export const DiscountRepository = dataSource
    .getRepository(Discount)
    .extend({
        // it is important to spread the existing repository here.
        //  Otherwise you will end up losing core properties
        ...Object.assign(MedusaDiscountRepository, {
            target: Discount,
        }),

        async updateDiscountStore(discountId: string, storeId: string): Promise<Discount | null> {
            const discount = await this.findOne(discountId);
            if (!discount) {
                return null;
            }

            discount.store_id = storeId;
            await this.save(discount);
            return discount;
        }
    })


export default DiscountRepository;