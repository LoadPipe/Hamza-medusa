import { Customer, MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import CustomerRepository from '../../../repositories/customer';
import { RouteHandler } from '../../route-handler';
import axios from 'axios';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    //const globeTopperService: GlobeTopperService =
    //    req.scope.resolve('globeTopperService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/giftcards'
    );

    await handler.handle(async () => {
        //https://partner.sandbox.globetopper.com/api/v2/catalogue/search-catalogue

        const gtProducts = await axios.get(
            'https://partner.sandbox.globetopper.com/api/v2/products/get-all-products',
            {
                headers: {
                    authorization:
                        'Bearer Shadstone:dgmer6i9lyrt1ftaftp3h3v56o5uxqh7',
                },
            }
        );

        const gtCatalogue = await axios.get(
            'https://partner.sandbox.globetopper.com/api/v2/catalogue/search-catalogue',
            {
                headers: {
                    authorization:
                        'Bearer Shadstone:dgmer6i9lyrt1ftaftp3h3v56o5uxqh7',
                },
            }
        );

        var products = [];

        gtProducts.data.records.foreach((record) => {
            products[record.operator.id] = {
                id: 'gt_' + record.operator.id,
                title: 'Gift Card: ' + record.name,
                description: record.description,
                is_giftcard: false,
                thumbnail: null,
                variants: [
                    {
                        title: 'Default',
                        'prices': [
                            {
                                amount: record.min,
                                currency_code: record.operator.currency.code
                            }
                        ]
                    }
                ]
            }
        });

        gtCatalogue.data.records.foreach((record) => {
            let id = record.topup_product_id;
            if (products[id]) {
                products[id].description = record.brand_description;
                products[id].thumbnail = record.card_image
            }
        });


        //console.log(results);
        console.log(products);

        return handler.returnStatus(200, { status: 'ok' });
    });
};
