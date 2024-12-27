import { Request, Response } from 'express';
import {
    ENDPOINT,
    serveRequest,
    validateRequiredHexString,
    validateStoreIdAndKeycard,
} from './utils.js';
import {
    HexString,
    ICreateProductInput,
    ICreateProductOutput,
    IUpdateProductInput,
    IUpdateProductOutput,
} from '../entity/index.js';
import { RelayClientWrapper } from '../massmarket/client.js';

export const productsController = {
    //create product
    createProducts: async (req: Request, res: Response) => {
        serveRequest(
            req,
            res,
            async (id, body) => {
                const input: ICreateProductInput = body;
                const output: ICreateProductOutput = {
                    success: false,
                    productIds: [],
                };

                //validation
                if (!validateCreateProductInput(res, input)) {
                    return null;
                }

                //get the client
                const rc = await RelayClientWrapper.get(
                    ENDPOINT,
                    input.storeId,
                    input.keycard
                );

                //add the product
                if (rc) {
                    const promises: Promise<HexString>[] = [];
                    for (let prod of input.products) {
                        console.log('creating product...');
                        output.productIds.push(await rc.createProduct(prod));
                    }

                    //TODO: better success check
                    output.success =
                        output.productIds.length == input.products.length;
                    console.log('returning ', output);
                }

                return output;
            },
            201
        );
    },

    //update product
    updateProduct: async (req: Request, res: Response) => {
        serveRequest(
            req,
            res,
            async (id, body) => {
                const productId = id;
                const input: IUpdateProductInput = body;
                const output: IUpdateProductOutput = {
                    success: false,
                };

                //validation
                if (!validateUpdateProductInput(res, productId, input)) {
                    return null;
                }

                //get the client
                const rc = await RelayClientWrapper.get(
                    ENDPOINT,
                    input.storeId,
                    input.keycard
                );

                //update the product
                if (rc) {
                    //TODO: update the product

                    output.success = true;
                }
                return output;
            },
            200
        );
    },

    listen: async (req: Request, res: Response) => {
        serveRequest(
            req,
            res,
            async (id, body) => {
                const productId = id;
                const input: IUpdateProductInput = body;
                const output = {
                    success: false,
                };

                //get the client
                const rc = await RelayClientWrapper.get(
                    ENDPOINT,
                    '0xf9bd19671391ec9ce554eb7b788e5c661a5906b70fbbf6f4adbbd8383623b058',
                    '0xff5724192f4d2b19c9d3fdca64a5bd04cb886ce20c2cedbccbe7ae0060bc6b53'
                );

                rc.startListeningForEvents();

                return output;
            },
            200
        );
    },
};

function validateCreateProductInput(
    res: Response,
    input: ICreateProductInput
): boolean {
    if (!validateStoreIdAndKeycard(res, input)) return false;
    return true;
}

function validateUpdateProductInput(
    res: Response,
    productId: HexString,
    input: IUpdateProductInput
): boolean {
    if (!validateRequiredHexString(res, productId, 'productId')) return false;
    if (!validateStoreIdAndKeycard(res, input)) return false;
    return true;
}
