import {
    Customer,
    MedusaRequest,
    MedusaResponse,
    ProductStatus,
} from '@medusajs/medusa';
import CustomerRepository from '../../../repositories/customer';
import { RouteHandler } from '../../route-handler';
import axios from 'axios';
import ProductService from '../../../services/product';
import { CreateProductInput } from '@medusajs/medusa/dist/types/product';
import GlobetopperService from '../../../services/globetopper';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const globeTopperService: GlobetopperService =
        req.scope.resolve('globetopperService');
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

        const gtRecords = [
            gtProducts.data.records.sort(
                (a, b) => (a?.operator?.id ?? 0) < (b?.operator?.id ?? 0)
            )[3],
        ];
        const gtCat = [
            gtCatalogue.data.records.sort(
                (a, b) =>
                    (a?.topup_product_id ?? 0) < (b?.topup_product_id ?? 0)
            )[3],
        ];

        for (let record of gtRecords) {
            console.log(record.operator.id);
            const productDetails = gtCat.find(
                (r) => (r.topup_product_id = record.operator.id)
            );
            productInputs.push(
                await globeTopperService.mapDataToProductInput(
                    record,
                    productDetails,
                    ProductStatus.DRAFT,
                    handler.inputParams.store_id,
                    'pcat_electronics',
                    'pcol_X',
                    []
                )
            );
        }

        /*
        gtRecords.forEach((record) => {
            productInputs[record.operator.id] = {
                title: 'Gift Card: ' + record.name,
                description: record.description,
                is_giftcard: false,
                thumbnail: null,
                handle: record.operator.id, //TODO: create handle from name + id
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

        gtCat.forEach((record) => {
            let id = record.topup_product_id;
            if (productInputs[id]) {
                productInputs[id].description = record.brand_description;
                productInputs[id].thumbnail = record.card_image;
            }
        });
        */

        console.log('importing ', productInputs.length, 'products');
        console.log(productInputs);

        const products = await productService.bulkImportProducts(
            handler.inputParams.store_id,
            productInputs
        );

        return handler.returnStatus(200, {
            status: 'ok',
            inputs: productInputs,
            data: products,
            records: gtRecords,
            cat: gtCat,
        });
    });
};
