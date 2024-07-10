import { Request, Response } from 'express';
import { ICreateStoreInput, ICreateStoreOutput } from '../entity/index.js';
import { RelayClientWrapper } from '../massmarket/client.js';
import { serveRequest, ENDPOINT } from './utils.js';

/*
Light Store: 
shopId 0xc7bf3136b9f2122179ae0d6a9463b45559900ce1874dde30613d520b39cafd15
keycard 0xd8b398a4cfca54f12d4b1505d631b5e95ce69664098f6aacbe32014b6c02b2ed

Blank (has no payee set)
shopId 0x46bab1409f853a98fa2bd191b1a8b812cd305e5a2706a8691d182209b68d5bab
keycard 0xf078d21d6d99f20262eb7eaf00997768c4de8452bbe360a3ceb23e28ed0590b8

Blank (has no payee set)
shopId 0x8f0f1f9a38c3c4ea65ff8bb42cb3ff04ec5c4c9654b9212f6be8c2ab97b603ed
keycard 0x820585f721ccdbedbdac039064d02f15f69dd325c753aa58a051b74c8cd058df
*/

export const storeController = {
    //create store
    createStore: async (req: Request, res: Response) => {
        serveRequest(
            req,
            res,
            async (id, body) => {
                const input: ICreateStoreInput = body;
                const output: ICreateStoreOutput = {
                    success: false,
                    storeId: '0x0',
                    keyCard: '0x0',
                };

                const data = await RelayClientWrapper.createAndInitializeStore(
                    ENDPOINT,
                    input.keycard
                );
                output.storeId = data.shopId;
                output.keyCard = data.keyCard;

                //TODO: check for zeroAddress
                output.success =
                    output.storeId.length > 0 && output.keyCard.length > 0;

                return output;
            },
            201
        );
    },

    enrollKeycard: async (req: Request, res: Response) => {
        serveRequest(
            req,
            res,
            async (id, body) => {
                const input: ICreateStoreInput = body;
                const output: ICreateStoreOutput = {
                    success: false,
                    storeId: '0x0',
                    keyCard: '0x0',
                };

                output.storeId = input.storeId;

                //TODO: check for zeroAddress
                output.keyCard = await RelayClientWrapper.enrollNewKeycard(
                    ENDPOINT,
                    input.storeId,
                    input.keycard
                );

                return output;
            },
            201
        );
    },
};
