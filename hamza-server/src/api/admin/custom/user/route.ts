import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const userService = req.scope.resolve('userService');
    const storeService = req.scope.resolve('storeService');
    const productCollectionService = req.scope.resolve(
        'productCollectionService'
    );

    const handler: RouteHandler = new RouteHandler(
        req, res, 'GET', '/admin/custom/user'
    );

    await handler.handle(async () => {
        const user0 = await userService.create(
            {
                email: 'medusaVendor@hamza.com',
                first_name: 'medusa',
                last_name: 'Vendor',
                wallet_address: '0xb794f5ea0ba39494ce839613fffba74279579268',
            },
            'password'
        );

        const user1 = await userService.create(
            {
                email: 'QualityVendor@hamza.com',
                first_name: 'Quality',
                last_name: 'Vendor',
                wallet_address: '0x6A75b412495838621e9352FE72fF5e9191DD5ab1',
            },
            'password'
        );

        const user2 = await userService.create(
            {
                email: 'HeadphonesVendor@hamza.com',
                first_name: 'Headphones',
                last_name: 'Vendor',
                wallet_address: '0x5728C7b8b448332Acda43369afa3a2c25C947D43',
            },
            'password'
        );

        const user3 = await userService.create(
            {
                email: 'indiana_drones@hamza.com',
                first_name: 'Indiana',
                last_name: 'Jones',
                wallet_address: '0x56348d548852e72d8c7fB24C89c7Fb1492504738',
            },
            'password'
        );

        const user4 = await userService.create(
            {
                email: 'jarl@jarburg.net',
                first_name: 'Jarl',
                last_name: 'Droischevnsky',
                wallet_address: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
            },
            'password'
        );

        const user5 = await userService.create(
            {
                email: 'support@gamefi-studios.io',
                first_name: 'GameFi',
                last_name: 'Studios',
                wallet_address: '0x999999cf1046e68e36E1aA2E0E07105eDDD1f08E',
            },
            'password'
        );

        const user6 = await userService.create(
            {
                email: 'support@razorsedge.io',
                first_name: 'Razors',
                last_name: 'Edge',
                wallet_address: '0xaffa87A79F532Fe0F5eB1aFD299A4199b9502663',
            },
            'password'
        );

        const user7 = await userService.create(
            {
                email: 'support@dunderchiefs.io',
                first_name: '21',
                last_name: 'Laptops',
                wallet_address: '0xcafd5561F02624D04D55F74297dD04e53f444B92',
            },
            'password'
        );

        const user8 = await userService.create(
            {
                email: 'jablinski@jablinksi-gaming.com',
                first_name: 'Jack',
                last_name: 'Black',
                wallet_address: '0xcafb8Cd7d8c5574f0c412619A08EC47f2eA1e434',
            },
            'password'
        );

        const user9 = await userService.create(
            {
                email: 'jern@javels.com',
                first_name: 'Jern',
                last_name: 'Javels',
                wallet_address: '0x4fBCF49cC0f91d66Bc5bBbE931913D8709592012',
            },
            'password'
        );

        const user10 = await userService.create(
            {
                email: 'horatio-turdburger@imagescience.org',
                first_name: 'Horatio',
                last_name: 'Turdmuncher',
                wallet_address: '0x0000F49cC0f91d66Bc5bBbE931913D8709500003',
            },
            'password'
        );

        const store0 = await storeService.createStore(
            user0,
            'Medusa Merch',
            'pcol_01HRVF8HCVY8B00RF5S54THTPC',
            'https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png'
        );
        const store1 = await storeService.createStore(
            user1,
            'Echo Rift',
            'pcol_01HSGAM4918EX0DETKY6E662WT',
            'https://images.hamza.biz/headphones.webp'
        );
        const store2 = await storeService.createStore(
            user2,
            'Dauntless',
            'pcol_01HSGAMXDJD725MR3VSW631SN2',
            'https://images.hamza.biz/dalle_vr.webp'
        );
        const store3 = await storeService.createStore(
            user3,
            'Drones',
            'pcol_01HSGAMXDJD725MR3VSW631DR0',
            'https://images.hamza.biz/Drones/dji_mini_4_pro/dji_mini_pro_1.jpg'
        );
        const store4 = await storeService.createStore(
            user4,
            'Legos',
            'pcol_01HSGAMXDJD725MR3VSW63LEG0',
            'https://images.hamza.biz/Lego/corvette/corvette_1.jpg'
        );
        const store5 = await storeService.createStore(
            user5,
            'Board Games',
            'pcol_01HSGAMXDJD725MR3VSW63B0RD',
            'https://images.hamza.biz/Board_Games/dark_souls/souls_1.jpg'
        );
        const store6 = await storeService.createStore(
            user6,
            'Workout Gear',
            'pcol_01HSGAMXDJD725MR3VSW63W0GE',
            'https://images.hamza.biz/Workout/dumbbell/dumb_2.jpg'
        );
        const store7 = await storeService.createStore(
            user7,
            'Gaming Gear',
            'pcol_01HSGAMXDJD725MR3VSW63W0GA',
            'https://images.hamza.biz/gaming_store/6.1.png'
        );
        const store8 = await storeService.createStore(
            user8,
            'Shake',
            'pcol_shake',
            'https://images.hamza.biz/headphones.webp'
        );
        const store9 = await storeService.createStore(
            user9,
            'Legendary Light Design',
            'pcol_lighting',
            'https://images.hamza.biz/Legendary/mood/LLD_mood1.webp'
        );
        const store10 = await storeService.createStore(
            user10,
            'Block',
            'pcol_blocks',
            'https://images.hamza.biz/headphones.webp'
        );

        await productCollectionService.update(
            'pcol_01HRVF8HCVY8B00RF5S54THTPC',
            { store_id: store0.id }
        );

        await productCollectionService.update(
            'pcol_01HSGAM4918EX0DETKY6E662WT',
            { store_id: store1.id }
        );

        await productCollectionService.update(
            'pcol_01HSGAMXDJD725MR3VSW631SN2',
            { store_id: store2.id }
        );

        await productCollectionService.update(
            'pcol_01HSGAMXDJD725MR3VSW631DR0',
            { store_id: store3.id }
        );

        await productCollectionService.update(
            'pcol_01HSGAMXDJD725MR3VSW63LEG0',
            { store_id: store4.id }
        );

        await productCollectionService.update(
            'pcol_01HSGAMXDJD725MR3VSW63B0RD',
            { store_id: store5.id }
        );

        await productCollectionService.update(
            'pcol_01HSGAMXDJD725MR3VSW63W0GE',
            { store_id: store6.id }
        );
        await productCollectionService.update('pcol_drones', {
            store_id: store3.id,
        });

        await productCollectionService.update('pcol_sound', {
            store_id: store4.id,
        });

        await productCollectionService.update('pcol_gamefi', {
            store_id: store5.id,
        });

        await productCollectionService.update('pcol_razor', {
            store_id: store6.id,
        });

        await productCollectionService.update(
            'pcol_01HSGAMXDJD725MR3VSW63W0GA',
            {
                store_id: store7.id,
            }
        );

        await productCollectionService.update('pcol_shake', {
            store_id: store8.id,
        });

        await productCollectionService.update('pcol_lighting', {
            store_id: store9.id,
        });

        await productCollectionService.update('pcol_blocks', {
            store_id: store10.id,
        });

        return res.json({
            user0,
            user1,
            user2,
            user3,
            user4,
            user5,
            user6,
            user7,
            user8,
            user9,
            user10,
            store0,
            store1,
            store2,
            store3,
            store4,
            store5,
            store6,
            store7,
            store8,
            store9,
            store10,
        });
    });
};
