import { ProductVariant } from '@medusajs/medusa';
import { dataSource } from '@medusajs/medusa/dist/loaders/database';

export const ProductVariantRepository =
    dataSource.getRepository(ProductVariant);
