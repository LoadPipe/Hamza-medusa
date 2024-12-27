import { MedusaRequest, MedusaResponse, ProductStatus } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import ProductService from '../../../services/product';
import { CreateProductInput } from '@medusajs/medusa/dist/types/product';
import GlobetopperService from '../../../services/globetopper';
import { GlobetopperClient } from '../../../globetopper/globetopper-client';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const globeTopperService: GlobetopperService =
        req.scope.resolve('globetopperService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/giftcards'
    );

    await handler.handle(async () => {
        //require params
        if (
            !handler.requireParams([
                'store_id',
                'sales_channel_id',
                'collection_id',
                'category_id',
            ])
        )
            return;

        //import
        const products = await globeTopperService.import(
            handler.inputParams.store_id,
            handler.inputParams.category_id,
            handler.inputParams.collection_id,
            handler.inputParams.sales_channel_id
        );

        return handler.returnStatus(
            200,
            {
                status: 'ok',
                data: products,
            },
            100
        );
    });
};
