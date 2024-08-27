import {
    MedusaRequest,
    MedusaResponse,
    SalesChannelService,
} from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import StoreService from '../../../../services/store';
import ProductCollectionRepository from '../../../../repositories/product-collection';
import BuckydropService from '../../../../services/buckydrop';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');
    let buckyService: BuckydropService = req.scope.resolve('buckydropService');
    let salesChannelService: SalesChannelService = req.scope.resolve(
        'salesChannelService'
    );
    let productCollectionRepository: typeof ProductCollectionRepository =
        req.scope.resolve('productCollectionRepository');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/admin/custom/bucky/import'
    );

    const getImportData = async (storeName: string) => {
        const output = {
            storeId: '',
            collectionId: '',
            salesChannelId: '',
        };

        output.storeId = (await storeService.getStoreByName(storeName)).id;
        output.collectionId = (
            await productCollectionRepository.findOne({
                where: { store_id: output.storeId },
            })
        ).id;

        const salesChannels = await salesChannelService.list({}, { take: 1 });
        output.salesChannelId = salesChannels[0].id;

        return output;
    };

    //soup bowls

    await handler.handle(async () => {
        const importData = await getImportData(
            handler.inputParams.store ?? 'Medusa Merch'
        );

        const goodsId = handler.inputParams.goodsId?.toString();
        const link = handler.inputParams.link?.toString();

        let output = {};
        if (link) {
            output = await buckyService.importProductsByLink(
                link,
                importData.storeId,
                importData.collectionId,
                importData.salesChannelId
            );
        }
        else {
            output = await buckyService.importProductsByKeyword(
                handler.inputParams.keyword.toString(),
                importData.storeId,
                importData.collectionId,
                importData.salesChannelId,
                parseInt(handler.inputParams.count?.toString() ?? '10'),
                parseInt(handler.inputParams.page?.toString() ?? '1'),
                goodsId
            );
        }

        return res.status(201).json({ status: true, output });
    });
};
