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
        ['currency', 'behavior', 'sales_channel', 'delete']
    );

    await handler.handle(async () => {
        /*
        behaviors: 
        add-only: new giftcards will be added, any that already exist in the database will be ignored/skipped
        update-only: giftcards that already exist will be updated; any that do not will be skipped 
        combined: new gift cards will be added, existing ones will be updated 
        */
        let behavior = handler.inputParams.behavior;
        let salesChannelId = handler.inputParams.sales_channel;
        let deleteFlag = handler.inputParams.delete === true;

        if (!behavior?.length) behavior = 'combined';

        if (!salesChannelId?.length) {
            const salesChannel = await salesChannelRepository.findOne({
                where: { id: Not(IsNull()) },
            });
            if (!salesChannel) {
                return handler.returnStatusWithMessage(
                    404,
                    `sales channel ${salesChannelId} not found`
                );
            }
            salesChannelId = salesChannel?.id;
        }

        //get the store
        const store = await storeRepository.findOne({
            where: { name: 'Gift Cards' },
        });

        const products = await globetopperService.import(
            store.id,
            behavior,
            'pcat_giftcards',
            'pcol_giftcards',
            salesChannelId,
            handler.hasParam('currency') //if currency is provided; otherwise use default
                ? handler.inputParams('currency')
                : undefined,
            deleteFlag
        );

        return res.json({ products });
    });
};
