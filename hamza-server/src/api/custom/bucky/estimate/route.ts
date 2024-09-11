import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import StoreService from '../../../../services/store';
import BuckydropService from '../../../../services/buckydrop';
import { BuckyLogRepository } from '../../../../repositories/bucky-log';
import { BuckyClient } from '../../../../buckydrop/bucky-client';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService: StoreService = req.scope.resolve('storeService');
    let buckyService: BuckydropService = req.scope.resolve('buckydropService');
    let buckyLogRepository: typeof BuckyLogRepository =
        req.scope.resolve('buckyLogRepository');
    let buckyClient: BuckyClient = new BuckyClient(buckyLogRepository);

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/admin/custom/bucky/estimate',
        ['count', 'page', 'link', 'store',]
    );

    await handler.handle(async () => {
        const response = await buckyClient.getShippingCostEstimate({
            lang: 'en',
            countryCode: 'TH',
            country: 'Thailand',
            provinceCode: 'Chiang Mai',
            province: 'Chiang Mai',
            detailAddress: '228/32 Soi Mu Ban Lanna Thara Village',
            postCode: '50230',
            productList: [{
                length: 1,
                width: 1,
                height: 1,
                weight: 1,
                categoryCode: '50009032',
            }],
        })

        return handler.returnStatus(200, { response });
    });
};
