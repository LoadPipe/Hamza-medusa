import { Customer, MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import CustomerRepository from '../../../repositories/customer';
import { RouteHandler } from '../../route-handler';
import axios from 'axios';
import ProductService from '../../../services/product';
import { CreateProductInput } from '@medusajs/medusa/dist/types/product';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    //const globeTopperService: GlobeTopperService =
    //    req.scope.resolve('globeTopperService');
    const productService: ProductService = req.scope.resolve('productService');

    const gtBearerToken: String =
        process.env.GLOBETOPPER_API_KEY + ':' + process.env.GLOBETOPPER_SECRET;

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/giftcards'
    );

    await handler.handle(async () => {
        //https://partner.sandbox.globetopper.com/api/v2/catalogue/search-catalogue

        //require params
        if (!handler.requireParam('store_id')) return;

        const gtProducts = await axios.get(
            process.env.GLOBETOPPER_API_URL + '/product/search-all-products',
            {
                headers: {
                    authorization: 'Bearer ' + gtBearerToken,
                },
            }
        );

        const gtCatalogue = await axios.get(
            process.env.GLOBETOPPER_API_URL + '/catalogue/search-catalogue',
            {
                headers: {
                    authorization: 'Bearer ' + gtBearerToken,
                },
            }
        );

        const productInputs: CreateProductInput[] = [];

        gtProducts.data.records.forEach((record) => {
            productInputs[record.operator.id] = {
                title: 'Gift Card: ' + record.name,
                description: record.description,
                is_giftcard: false,
                thumbnail: null,
                handle: record.operator.id,
                external_id: record.operator.id,
                variants: [
                    {
                        inventory_quantity: 9999,
                        title: 'Default',
                        prices: [
                            {
                                amount: Math.floor(record.min * 100),
                                currency_code:
                                    record.operator.country.currency.code,
                            },
                        ],
                    },
                ],
            };
        });

        gtCatalogue.data.records.forEach((record) => {
            let id = record.topup_product_id;
            if (productInputs[id]) {
                productInputs[id].description = record.brand_description;
                productInputs[id].thumbnail = record.card_image;
            }
        });

        console.log(productInputs[0]);

        const products = await productService.bulkImportProducts(
            handler.inputParams.store_id,
            [productInputs[gtProducts.data.records[0].operator.id]]
        );

        return handler.returnStatus(200, {
            status: 'ok',
            data: products,
            records: [gtProducts.data.records[0]],
            inputs: [productInputs[0]],
        });
    });
};
