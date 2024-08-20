import {
    MedusaRequest,
    MedusaResponse,
    SalesChannelService,
} from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';
import StoreService from '../../../services/store';
import ProductCollectionRepository from '../../../repositories/product-collection';
import BuckydropService from '../../../services/buckydrop';

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
        '/admin/custom/bucky'
    );

    const getImportData = async () => {
        const output = {
            storeId: '',
            collectionId: '',
            salesChannelId: '',
        };

        output.storeId = (await storeService.getStoreByName('Medusa Merch')).id;
        output.collectionId = (
            await productCollectionRepository.findOne({
                where: { store_id: output.storeId },
            })
        ).id;

        const salesChannels = await salesChannelService.list({}, { take: 1 });
        output.salesChannelId = salesChannels[0].id;

        return output;
    };

    await handler.handle(async () => {
        const importData = await getImportData();

        const output = await buckyService.importProductsByKeyword(
            'art',
            importData.storeId,
            importData.collectionId,
            importData.salesChannelId
        );

        return res.status(201).json({ status: true, products: output });
    });
};
