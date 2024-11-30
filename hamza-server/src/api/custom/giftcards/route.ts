import { Customer, MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import CustomerRepository from '../../../repositories/customer';
import { RouteHandler } from '../../route-handler';
import axios from 'axios';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    //const globeTopperService: GlobeTopperService =
    //    req.scope.resolve('globeTopperService');

    const gtBearerToken: String = process.env.GLOBETOPPER_API_KEY + ':' + process.env.GLOBETOPPER_SECRET;

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/giftcards'
    );

    await handler.handle(async () => {
        //https://partner.sandbox.globetopper.com/api/v2/catalogue/search-catalogue

        const gtProducts = await axios.get(
            process.env.GLOBETOPPER_API_URL + '/product/search-all-products',
            {
                headers: {
                    authorization:
                        'Bearer ' + gtBearerToken,
                },
            }
        );

        const gtCatalogue = await axios.get(
            process.env.GLOBETOPPER_API_URL + '/catalogue/search-catalogue',
            {
                headers: {
                    authorization:
                    'Bearer ' + gtBearerToken,
                },
            }
        );

        var products = [];

        gtProducts.data.records.forEach((record) => {
            products[record.operator.id] = {
                id: 'gt_' + record.operator.id,
                title: 'Gift Card: ' + record.name,
                description: record.description,
                is_giftcard: false,
                thumbnail: null,
                external_id: record.operator.id,
                variants: [
                    {
                        title: 'Default',
                        'prices': [
                            {
                                amount: record.min,
                                currency_code: record.operator.country.currency.code
                            }
                        ]
                    }
                ]
            }
        });

        gtCatalogue.data.records.forEach((record) => {
            let id = record.topup_product_id;
            if (products[id]) {
                products[id].description = record.brand_description;
                products[id].thumbnail = record.card_image;
            }
        });

        products = products.filter(Boolean);


        //console.log(results);
        console.log(products[0]);

        return handler.returnStatus(200, { status: 'ok', data: products });
    });
};
