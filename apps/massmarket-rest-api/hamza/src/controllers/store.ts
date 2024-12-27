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

Good with Payee: 
1
shopId 0x6df3380a85b85432e2884a05ae477f8847821de866f0e69594bab094127238a5
keycard 0x66c34a40a9f6b0b947e888181a585af7ba6e751446fd239f66cd83ef79ac9b6a
2
shopId 0xe810f5bc3e3889bb1e6db9d4d8d2b486366ad99716732d74b734e6a4251e4ee9
keycard 0xb405b8003a5e84ebf67edcbce30cf9e77e32ef17b41a7c9d0298b83f19cac9c2
3
shopId 0xa5529b05d40f7189e52988918bef584128f037b8289bc5deb4f02745546a74d4
keycard 0x9e640178bc719feca2d8b4ed19a39c38c83c0fc398cf506e6558dbaa22365a17
4
shopId 0xb12e73bc2f6c6beff0a9538ee72dea5aa7c6626e7eb16ab08646528b55d77241
keycard 0x28dadff504e9ba14d173cbd08aea650db2299783f58fab561616c52cbcc275ed
5
shopId 0xb6a73bd3ed64d7aa8ab124e045be31a7f9e1add3a47c4371ccb707a75219a21d
keycard 0x41f5dc26e0b62bd2c5ce3e4ed5cb3b153d7a7d87ae3f046f0be190dcad548097
6
shopId 0x3acac564f40baf2d070f2fd9f20ec42c1ed5b84c62b91c0a6dca0b7ee5cb2027
keycard 0xee6372c11170059d799ae237a283c91c135e15fd469e3899ce53d66d8b72cf60
7
shopId 0xe7f7371cb34a8373cd62a68e2ce71f4260cdc8edf0a0cf88a502929a810f7758
keycard 0x962dd7ee5396d39c3bab79e82c99c8b8492c2777f80a50c76b2850e9af1818d2
8
shopId 0x96dc0aa5b46adbc9799924a4f963ea8f3a56e39d5356ad03fc32fda20472a0e1
keycard 0xe5283f222d0c4e7d86b1aa5634e5a95f3264da4a487ce2c80e25499c684e0441
9
shopId 0xce095f8324de5bdb3266fe2ca5e3d88534c8dc9b8c25c1f011115c80ec6b14bf
keycard 0x3db3fedf13c6e2c12e353de02a89e4f49068d65586d086c59d15dd8cba4039a8


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
