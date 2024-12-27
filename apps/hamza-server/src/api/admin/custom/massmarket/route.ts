import { MedusaRequest, MedusaResponse, Logger, Product } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import { Config } from '../../../../config';

const productsToIds = {
    //Medusa Merch
    'Medusa Coffee Mug':
        '0x92bc9e6b60e3bb98c3f13e99ceb8a5604edeb05ad3fa6d54751b07739b670564',

    //Legendary Light
    'INDOOR/OUTDOOR WALL LAMP M - W100 X D4':
        '0x6daba4e86c82fae30a1968f34d52dfe355be084258dadca22cc61be44e0fcb23',
    'Tripod RGB Spine':
        '0xec1b576bfd5b19cafbeea87a57a88e0f281fb95b135b19b11d7ef68e4b06453a',
    'RGB LED Strips':
        '0xccf005507aa57ec97227edec1d244810a8ceabd540401b4a10676c0ce23e8029',
    'LED RGB Wall Art':
        '0xc1197bda71004750fff4b97bb924b45aed9d8576e16700de711f613fe6fc1d22',
    '3D Infinity Mirror':
        '0x1cd6d920bd8acaf77f23f7947cc8519b9af2d12670710927dbadf9bdd9c9ab2e',
    '12 Pack Black Recessed Lights 6 Inch, Dimmable':
        '0x866b7abc209a28a7bd66866a84d279e4157b6a00a2cd4e7210abdcfab315004e',

    //Echo Rift
    'The Streamline Rift':
        '0x5f7fb9d835068de2d6d0be591056b23342ce205794b9cd6f6b3545450b7d7ef3',

    //Dauntless
    'The Visionary':
        '0xe5bcb69042566ccf04cbaf9e04b40cd2452e4346d3b172cd1d00090a4eae5480',

    //Lego
    'LEGO Icons Corvette Classic Car':
        '0xd7371f003cd7275158d91c6ac2c2ebbde3c70b936c6fca45acd722a630cfa84b',

    //Drones
    'DJI Mini 3 Pro with Flagship Triple-Camera':
        '0xe149369c77068879fc6dc632baeb764b7a71784ed942990eced76e825c01ab63',

    //Board games
    'Dark Souls: The Board Game':
        '0xbcc7960e6010da7f8f68bb35c2498d08e6949f43d2d424c13d1556dac0c1b896',

    //Workout
    'ihuan Ventilated Weight Lifting Gym Workout Gloves':
        '0xa6b24c5a6da564f24be8af1e4548344f5b4c750d875d390f6b45c7ca4f39d232',
};

const storesToIds = {
    'Medusa Merch': {
        storeId:
            '0xf9bd19671391ec9ce554eb7b788e5c661a5906b70fbbf6f4adbbd8383623b058',
        keycard:
            '0xd476aa67d4ab33576da3db6d75fd8e93782ba50b13a0fc3b442d05869e2612df',
    },
    'Legendary Light Design': {
        storeId:
            '0x805e83d38d5c946bc1559f7d80ce94bce13a4cc0ec4640426bc81835f5958a57',
        keycard:
            '0x0000000000000000000000000000000000000000000000000000000000000007',
    },
    'Echo Rift': {
        storeId:
            '0x6df3380a85b85432e2884a05ae477f8847821de866f0e69594bab094127238a5',
        keycard:
            '0x66c34a40a9f6b0b947e888181a585af7ba6e751446fd239f66cd83ef79ac9b6a',
    },
    Dauntless: {
        storeId:
            '0xe810f5bc3e3889bb1e6db9d4d8d2b486366ad99716732d74b734e6a4251e4ee9',
        keycard:
            '0xb405b8003a5e84ebf67edcbce30cf9e77e32ef17b41a7c9d0298b83f19cac9c2',
    },
    Drones: {
        storeId:
            '0xa5529b05d40f7189e52988918bef584128f037b8289bc5deb4f02745546a74d4',
        keycard:
            '0x9e640178bc719feca2d8b4ed19a39c38c83c0fc398cf506e6558dbaa22365a17',
    },
    Legos: {
        storeId:
            '0xb12e73bc2f6c6beff0a9538ee72dea5aa7c6626e7eb16ab08646528b55d77241',
        keycard:
            '0x28dadff504e9ba14d173cbd08aea650db2299783f58fab561616c52cbcc275ed',
    },
    'Board Games': {
        storeId:
            '0xb6a73bd3ed64d7aa8ab124e045be31a7f9e1add3a47c4371ccb707a75219a21d',
        keycard:
            '0x41f5dc26e0b62bd2c5ce3e4ed5cb3b153d7a7d87ae3f046f0be190dcad548097',
    },
    'Workout Gear': {
        storeId:
            '0x3acac564f40baf2d070f2fd9f20ec42c1ed5b84c62b91c0a6dca0b7ee5cb2027',
        keycard:
            '0xee6372c11170059d799ae237a283c91c135e15fd469e3899ce53d66d8b72cf60',
    },
    'Lofi Jungle': {
        storeId:
            '0xe7f7371cb34a8373cd62a68e2ce71f4260cdc8edf0a0cf88a502929a810f7758',
        keycard:
            '0x962dd7ee5396d39c3bab79e82c99c8b8492c2777f80a50c76b2850e9af1818d2',
    },
    Shake: {
        storeId:
            '0x96dc0aa5b46adbc9799924a4f963ea8f3a56e39d5356ad03fc32fda20472a0e1',
        keycard:
            '0xe5283f222d0c4e7d86b1aa5634e5a95f3264da4a487ce2c80e25499c684e0441',
    },
    Block: {
        storeId:
            '0xce095f8324de5bdb3266fe2ca5e3d88534c8dc9b8c25c1f011115c80ec6b14bf',
        keycard:
            '0x3db3fedf13c6e2c12e353de02a89e4f49068d65586d086c59d15dd8cba4039a8',
    },
};


async function updateStoreForMM(
    storeRepository,
    productService,
    storeId: string,
    storeName: string
) {
    let storeCreds = storesToIds[storeName];
    if (!storeCreds)
        storeCreds = {
            storeId: '',
            keycard: '',
        };

    await storeRepository.save({
        id: storeId,
        massmarket_store_id: storeCreds.storeId,
        massmarket_keycard: storeCreds.keycard,
    });

    const products =
        await productService.getProductsFromStoreWithPrices(storeId);
    for (let prod of products) {
        let mmid = productsToIds[prod.title];
        if (!mmid) mmid = '';
        if (mmid) {
            await productService.update(prod.id, { massmarket_prod_id: mmid });
        }
    }
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const storeService = req.scope.resolve('storeService');
    const storeRepository = req.scope.resolve('storeRepository');
    const productService = req.scope.resolve('productService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'POST', '/admin/custom/massmarket',
    );

    await handler.handle(async () => {
        if (Config.dataSeed != 'alt1') {
            const stores = await storeService.getStores();
            for (let store of stores) {
                await updateStoreForMM(
                    storeRepository,
                    productService,
                    store.id,
                    store.name
                );
            }
        }

        return res.json({ ok: true });
    });
};
