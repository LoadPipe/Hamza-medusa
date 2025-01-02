import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../../route-handler';
import StoreRepository from '../../../../../repositories/store';
import SalesChannelRepository from '@medusajs/medusa/dist/repositories/sales-channel';
import { IsNull, Not } from 'typeorm';
import GlobetopperService from '../../../../../services/globetopper';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeRepository: typeof StoreRepository =
        req.scope.resolve('storeRepository');
    const salesChannelRepository: typeof SalesChannelRepository =
        req.scope.resolve('salesChannelRepository');
    const globetopperService: GlobetopperService =
        req.scope.resolve('globetopperService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'POST',
        '/admin/custom/setup/giftcards',
        ['currency']
    );

    await handler.handle(async () => {
        //get the store
        const store = await storeRepository.findOne({
            where: { name: 'Gift Cards' },
        });
        const salesChannel = await salesChannelRepository.findOne({
            where: { id: Not(IsNull()) },
        });

        const products = await globetopperService.import(
            store.id,
            'pcat_giftcards',
            'pcol_giftcards',
            salesChannel.id,
            handler.hasParam('currency') //if currency is provided; otherwise use default
                ? handler.inputParams('currency')
                : undefined
        );

        return res.json({ products });
    });
};
