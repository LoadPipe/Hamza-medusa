import { MedusaRequest, MedusaResponse, ProductStatus } from '@medusajs/medusa';
import ProductService, {
    BulkImportProductInput,
} from '../../../../services/product';
import { RouteHandler } from '../../../route-handler';
import { BuckyClient } from '../../../../buckydrop/bucky-client';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    let productService: ProductService = req.scope.resolve('productService');
};
