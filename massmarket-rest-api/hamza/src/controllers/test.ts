import { Request, Response } from 'express';
import { RelayClient } from '@massmarket/client';
import { privateKeyToAccount } from 'viem/accounts';
import { serveRequest } from './utils.js';
import { sepolia } from 'viem/chains';
import {
    http,
    createWalletClient,
    PrivateKeyAccount,
    bytesToHex,
    hexToBytes,
} from 'viem';
import { RelayClientWrapper } from '../massmarket/client.js';
import { randomBytes } from 'crypto';
//import { createWalletClient } from "../node_modules/viem/_types/index";

const stores = [
    {
        storeId:
            '0x382e9fdf10295e01ad4c7e4dc7e3cecf461016addbe8e15e55736983af39426c',
        keycard:
            '0x1d24055a9122ab48d62e9f65f37335f844d7de6858edf61d3ca115efbe82be86',
    },
];

export const testController = {
    test: async (req: Request, res: Response) => {
        serveRequest(
            req,
            res,
            async (id, body) => {
                /*
                shopId 0x382e9fdf10295e01ad4c7e4dc7e3cecf461016addbe8e15e55736983af39426c
                keycard 0x6f9986adb793d928a1ded3d185397d1150d4138aebeafccf5162a0dd56094231
                
                shopId 0x9df5cfee9daa70d339591d5d78d75612220e36b7a3e46c6034f8131cb2db16cb
                keycard 0x757da489fe6691b6c547b8d20b4f4db274367bcce21b786c31a6fdb61a989e44

                */
                const rc = new RelayClientWrapper(
                    `relay-beta.mass.market/v2`,
                    '0xf9bd19671391ec9ce554eb7b788e5c661a5906b70fbbf6f4adbbd8383623b058',
                    '0xd476aa67d4ab33576da3db6d75fd8e93782ba50b13a0fc3b442d05869e2612df'
                );

                await rc.setErc20('0x0000000000000000000000000000000000000000');
                /*
                console.log('setting 1');
                await rc.setErc20('0x822585D682B973e4b1B47C0311f162b29586DD02');
                console.log('setting 2');
                await rc.setErc20('0xbe9fe9b717c888a2b2ca0a6caa639afe369249c5');

                console.log('setting payee');
                await rc.setPayee(
                    'hamza-switch',
                    '0x74b7284836F753101bD683C3843e95813b381f18'
                );
                */
                console.log('done');
            },
            201
        );
    },

    checkout: async (req: Request, res: Response) => {
        serveRequest(
            req,
            res,
            async (id, body) => {
                /*
                shopId 0x382e9fdf10295e01ad4c7e4dc7e3cecf461016addbe8e15e55736983af39426c
                keycard 0x6f9986adb793d928a1ded3d185397d1150d4138aebeafccf5162a0dd56094231
                
                shopId 0x9df5cfee9daa70d339591d5d78d75612220e36b7a3e46c6034f8131cb2db16cb
                keycard 0x757da489fe6691b6c547b8d20b4f4db274367bcce21b786c31a6fdb61a989e44

                */
                const rc = new RelayClientWrapper(
                    `relay-beta.mass.market/v2`,
                    '0x805e83d38d5c946bc1559f7d80ce94bce13a4cc0ec4640426bc81835f5958a57',
                    '0x0000000000000000000000000000000000000000000000000000000000000007'
                );

                //product: 0x3736fa407ac3ba42ad6f4d2625c38d160db135a59f871ffe151ca73398e275e6

                console.log('create cart');
                const cartId = await rc.createCart();
                console.log('add to cart');
                await rc.addToCart(
                    cartId,
                    '0x866b7abc209a28a7bd66866a84d279e4157b6a00a2cd4e7210abdcfab315004e'
                );

                console.log('commit cart', cartId);
                await rc.commitCart(cartId);
            },
            201
        );
    },

    createProduct: async (req: Request, res: Response) => {
        serveRequest(
            req,
            res,
            async (id, body) => {
                /*
                shopId 0x382e9fdf10295e01ad4c7e4dc7e3cecf461016addbe8e15e55736983af39426c
                keycard 0x6f9986adb793d928a1ded3d185397d1150d4138aebeafccf5162a0dd56094231
                
                shopId 0x9df5cfee9daa70d339591d5d78d75612220e36b7a3e46c6034f8131cb2db16cb
                keycard 0x757da489fe6691b6c547b8d20b4f4db274367bcce21b786c31a6fdb61a989e44

                */
                const rc = new RelayClientWrapper(
                    `relay-beta.mass.market/v2`,
                    '0x382e9fdf10295e01ad4c7e4dc7e3cecf461016addbe8e15e55736983af39426c',
                    '0x6f9986adb793d928a1ded3d185397d1150d4138aebeafccf5162a0dd56094231'
                );

                //product: 0x3736fa407ac3ba42ad6f4d2625c38d160db135a59f871ffe151ca73398e275e6

                console.log(
                    await rc.createProduct({
                        price: '0.11',
                        name: 'test',
                        description: 'test',
                        image: 'http',
                    })
                );
            },
            201
        );
    },

    createStore: async (req: Request, res: Response) => {
        serveRequest(
            req,
            res,
            async (id, body) => {
                /*
                shopId 0x382e9fdf10295e01ad4c7e4dc7e3cecf461016addbe8e15e55736983af39426c
                keycard 0x6f9986adb793d928a1ded3d185397d1150d4138aebeafccf5162a0dd56094231
                
                shopId 0x9df5cfee9daa70d339591d5d78d75612220e36b7a3e46c6034f8131cb2db16cb
                keycard 0x757da489fe6691b6c547b8d20b4f4db274367bcce21b786c31a6fdb61a989e44
                */

                return await RelayClientWrapper.createAndInitializeStore(
                    `relay-beta.mass.market/v2`,
                    '0x000'
                );
            },
            201
        );
    },

    enroll: async (req: Request, res: Response) => {
        serveRequest(
            req,
            res,
            async (id, body) => {
                /*
                shopId 0x382e9fdf10295e01ad4c7e4dc7e3cecf461016addbe8e15e55736983af39426c
                keycard 0x6f9986adb793d928a1ded3d185397d1150d4138aebeafccf5162a0dd56094231
                
                shopId 0x9df5cfee9daa70d339591d5d78d75612220e36b7a3e46c6034f8131cb2db16cb
                keycard 0x757da489fe6691b6c547b8d20b4f4db274367bcce21b786c31a6fdb61a989e44
                */
                const rc = new RelayClientWrapper(
                    `relay-beta.mass.market/v2`,
                    '0x000',
                    '0x000',
                    false
                );

                await rc.enrollKeycard(
                    '0x000'
                );
            },
            201
        );
    },

    setCurrencies: async (req: Request, res: Response) => {
        serveRequest(
            req,
            res,
            async (id, body) => {
                /*
                shopId 0x382e9fdf10295e01ad4c7e4dc7e3cecf461016addbe8e15e55736983af39426c
                keycard 0x6f9986adb793d928a1ded3d185397d1150d4138aebeafccf5162a0dd56094231
                
                shopId 0x9df5cfee9daa70d339591d5d78d75612220e36b7a3e46c6034f8131cb2db16cb
                keycard 0x757da489fe6691b6c547b8d20b4f4db274367bcce21b786c31a6fdb61a989e44
                */
                const rc = new RelayClientWrapper(
                    `relay-beta.mass.market/v2`,
                    '0x805e83d38d5c946bc1559f7d80ce94bce13a4cc0ec4640426bc81835f5958a57',
                    '0x0000000000000000000000000000000000000000000000000000000000000007'
                );

                console.log('set 1');
                await rc.setPayee(
                    'hamza-switch',
                    '0x74b7284836F753101bD683C3843e95813b381f18'
                );
                console.log('set 2');
                await rc.setErc20('0x0000000000000000000000000000000000000000');
                console.log('set 3');
                await rc.setErc20('0x822585D682B973e4b1B47C0311f162b29586DD02');
                console.log('set 4');
                await rc.setErc20('0xbe9fe9b717c888a2b2ca0a6caa639afe369249c5');
                console.log('done');
            },
            201
        );
    },
};
