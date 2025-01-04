import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../../../route-handler';
import WhiteListService from '../../../../../services/whitelist';
import StoreService from '../../../../../services/store';
import { ProductCollection } from '../../../../../models/product-collection';
import ProductRepository from '@medusajs/medusa/dist/repositories/product';
import { StoreShippingSpecRepository } from 'src/repositories/store-shipping-spec';
import { randomInt } from 'crypto';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const userService = req.scope.resolve('userService');
    const storeService: StoreService = req.scope.resolve('storeService');
    const whitelistService: WhiteListService =
        req.scope.resolve('whitelistService');
    const productCollectionService = req.scope.resolve(
        'productCollectionService'
    );
    const productRepository: typeof ProductRepository =
        req.scope.resolve('productRepository');
    const shippingSpecRepository: typeof StoreShippingSpecRepository =
        req.scope.resolve('storeShippingSpecRepository');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'POST',
        '/admin/custom/setup/user'
    );

    await handler.handle(async () => {
        const users = await Promise.all([
            userService.create(
                {
                    email: 'medusaVendor@hamza.com',
                    first_name: 'medusa',
                    last_name: 'Vendor',
                    wallet_address:
                        '0xb794f5ea0ba39494ce839613fffba74279579268'.toLowerCase(),
                },
                'password'
            ),
            userService.create(
                {
                    email: 'QualityVendor@hamza.com',
                    first_name: 'Quality',
                    last_name: 'Vendor',
                    wallet_address:
                        '0x6A75b412495838621e9352FE72fF5e9191DD5ab1'.toLowerCase(),
                },
                'password'
            ),
            userService.create(
                {
                    email: 'HeadphonesVendor@hamza.com',
                    first_name: 'Headphones',
                    last_name: 'Vendor',
                    wallet_address:
                        '0x5728C7b8b448332Acda43369afa3a2c25C947D43'.toLowerCase(),
                },
                'password'
            ),
            userService.create(
                {
                    email: 'indiana_drones@hamza.com',
                    first_name: 'Indiana',
                    last_name: 'Jones',
                    wallet_address:
                        '0x56348d548852e72d8c7fB24C89c7Fb1492504738'.toLowerCase(),
                },
                'password'
            ),
            userService.create(
                {
                    email: 'jarl@jarburg.net',
                    first_name: 'Jarl',
                    last_name: 'Droischevnsky',
                    wallet_address:
                        '0xc0ffee254729296a45a3885639AC7E10F9d54979'.toLowerCase(),
                },
                'password'
            ),
            userService.create(
                {
                    email: 'support@gamefi-studios.io',
                    first_name: 'GameFi',
                    last_name: 'Studios',
                    wallet_address:
                        '0xb975Bf5ca0b09E17834d0b5A526F8315F82986D4'.toLowerCase(),
                },
                'password'
            ),

            userService.create(
                {
                    email: 'support@razorsedge.io',
                    first_name: 'Razors',
                    last_name: 'Edge',
                    wallet_address:
                        '0xfB20a78fD35D20925af6F7379Ab35Fa6C41e9834'.toLowerCase(),
                },
                'password'
            ),
            userService.create(
                {
                    email: 'support@dunderchiefs.io',
                    first_name: '21',
                    last_name: 'Laptops',
                    wallet_address:
                        '0x9315fe04f0e18AA0F8C92e98f6783177A2156D1F'.toLowerCase(),
                },
                'password'
            ),
            userService.create(
                {
                    email: 'jablinski@jablinksi-gaming.com',
                    first_name: 'Jack',
                    last_name: 'Black',
                    wallet_address:
                        '0xcafb8Cd7d8c5574f0c412619A08EC47f2eA1e434'.toLowerCase(),
                },
                'password'
            ),

            userService.create(
                {
                    email: 'jern@javels.com',
                    first_name: 'Jern',
                    last_name: 'Javels',
                    wallet_address:
                        '0x8bA35513C3F5ac659907D222e3DaB38b20f8F52A'.toLowerCase(),
                },
                'password'
            ),
            userService.create(
                {
                    email: 'horatio-turdburger@imagescience.org',
                    first_name: 'Horatio',
                    last_name: 'Turdmuncher',
                    wallet_address:
                        '0x0000F49cC0f91d66Bc5bBbE931913D8709500003'.toLowerCase(),
                },
                'password'
            ),
            userService.create(
                {
                    email: 'minanas@gmail.org',
                    first_name: 'Minanas',
                    last_name: 'Minaninski',
                    wallet_address:
                        '0x0000F49cC0f91d66Bc5bBbE931913D8709500008'.toLowerCase(),
                },
                'password'
            ),
        ]);

        // Destructing the users array
        const [
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
            user11,
        ] = users;

        const stores = await Promise.all([
            storeService.createStore(
                user0,
                'Medusa Merch',
                'pcol_01HRVF8HCVY8B00RF5S54THTPC',
                'https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png',
                500,
                'Medusa Merch Store where we sell our Medusa Sweatpants, its a nice store',
                {
                    11155111: {
                        address: '0x77930414Ba3E8f8799A9e503d2E6A9CBC95F42B6',
                        version: '1.0',
                    },
                    80002: {
                        address: '0xEb6b6144B0DDC6494FB7483D209ecc41A7Ae2Cc5',
                        version: '1.0',
                    },
                }
            ),
            storeService.createStore(
                user1,
                'Echo Rift',
                'pcol_01HSGAM4918EX0DETKY6E662WT',
                'https://images.hamza.market/headphones.webp',
                200,
                "We Sell VR Headsets here, the best quality VR headsets you wouldn't believe it",
                {
                    11155111: {
                        address: '0x77930414Ba3E8f8799A9e503d2E6A9CBC95F42B6',
                        version: '1.0',
                    },
                    80002: {
                        address: '0xEb6b6144B0DDC6494FB7483D209ecc41A7Ae2Cc5',
                        version: '1.0',
                    },
                }
            ),
            storeService.createStore(
                user2,
                'Dauntless',
                'pcol_01HSGAMXDJD725MR3VSW631SN2',
                'https://images.hamza.market/dalle_vr.webp',
                450,
                'Dauntless Store - Where bold and resilient products meet exceptional quality. Perfect for those who seek adventure and durability in every purchase.',
                {
                    11155111: {
                        address: '0x77930414Ba3E8f8799A9e503d2E6A9CBC95F42B6',
                        version: '1.0',
                    },
                    80002: {
                        address: '0xEb6b6144B0DDC6494FB7483D209ecc41A7Ae2Cc5',
                        version: '1.0',
                    },
                }
            ),

            storeService.createStore(
                user3,
                'Drones',
                'pcol_01HSGAMXDJD725MR3VSW631DR0',
                'https://images.hamza.market/Drones/dji_mini_4_pro/dji_mini_pro_1.jpg',
                720,
                'Drones Store - Your go-to destination for cutting-edge aerial technology. Explore our wide range of high-performance drones perfect for every enthusiast.',
                {
                    11155111: {
                        address: '0x77930414Ba3E8f8799A9e503d2E6A9CBC95F42B6',
                        version: '1.0',
                    },
                    80002: {
                        address: '0xEb6b6144B0DDC6494FB7483D209ecc41A7Ae2Cc5',
                        version: '1.0',
                    },
                }
            ),

            storeService.createStore(
                user4,
                'Legos',
                'pcol_01HSGAMXDJD725MR3VSW63LEG0',
                'https://images.hamza.market/Lego/corvette/corvette_1.jpg',
                315,
                'Legos Store - Dive into the world of creativity and building blocks. Find the latest Lego sets and build your imagination with endless possibilities.',
                {
                    11155111: {
                        address: '0x77930414Ba3E8f8799A9e503d2E6A9CBC95F42B6',
                        version: '1.0',
                    },
                    80002: {
                        address: '0xEb6b6144B0DDC6494FB7483D209ecc41A7Ae2Cc5',
                        version: '1.0',
                    },
                }
            ),
            storeService.createStore(
                user5,
                'Board Games',
                'pcol_01HSGAMXDJD725MR3VSW63B0RD',
                'https://images.hamza.market/Board_Games/dark_souls/souls_1.jpg',
                860,
                'Board Games Store - A haven for tabletop enthusiasts. Discover a wide selection of board games, from strategy to family fun, and everything in between.',
                {
                    11155111: {
                        address: '0x77930414Ba3E8f8799A9e503d2E6A9CBC95F42B6',
                        version: '1.0',
                    },
                    80002: {
                        address: '0xEb6b6144B0DDC6494FB7483D209ecc41A7Ae2Cc5',
                        version: '1.0',
                    },
                }
            ),
            storeService.createStore(
                user6,
                'Workout Gear',
                'pcol_01HSGAMXDJD725MR3VSW63W0GE',
                'https://images.hamza.market/Workout/dumbbell/dumb_2.jpg',
                580,
                'Workout Gear Store - Equip yourself with the best in fitness gear. From weights to apparel, we have everything you need to power your workouts.',
                {
                    11155111: {
                        address: '0x77930414Ba3E8f8799A9e503d2E6A9CBC95F42B6',
                        version: '1.0',
                    },
                    80002: {
                        address: '0xEb6b6144B0DDC6494FB7483D209ecc41A7Ae2Cc5',
                        version: '1.0',
                    },
                }
            ),
            storeService.createStore(
                user7,
                'Gaming Gear',
                'pcol_01HSGAMXDJD725MR3VSW63W0GA',
                'https://images.hamza.market/gaming_store/6.1.png',
                930,
                'Gaming Gear Store - Elevate your gaming experience with top-tier gear. Find the latest peripherals, accessories, and more for the ultimate gaming setup.',
                {
                    11155111: {
                        address: '0x77930414Ba3E8f8799A9e503d2E6A9CBC95F42B6',
                        version: '1.0',
                    },
                    80002: {
                        address: '0xEb6b6144B0DDC6494FB7483D209ecc41A7Ae2Cc5',
                        version: '1.0',
                    },
                }
            ),
            storeService.createStore(
                user8,
                'Shake',
                'pcol_shake',
                'https://images.hamza.market/headphones.webp',
                290,
                'Shake Store - Blend your way to a healthier lifestyle. Our store offers a range of premium shakes and blenders for the health-conscious consumer.',
                {
                    11155111: {
                        address: '0x77930414Ba3E8f8799A9e503d2E6A9CBC95F42B6',
                        version: '1.0',
                    },
                    80002: {
                        address: '0xEb6b6144B0DDC6494FB7483D209ecc41A7Ae2Cc5',
                        version: '1.0',
                    },
                }
            ),
            storeService.createStore(
                user9,
                'Legendary Light Design',
                'pcol_lighting',
                'https://images.hamza.market/Legendary/mood/LLD_mood1.webp',
                670,
                'Legendary Light Design Store - Illuminate your space with style. Explore our collection of designer lighting solutions for a touch of elegance and functionality.',
                {
                    11155111: {
                        address: '0x77930414Ba3E8f8799A9e503d2E6A9CBC95F42B6',
                        version: '1.0',
                    },
                    80002: {
                        address: '0xEb6b6144B0DDC6494FB7483D209ecc41A7Ae2Cc5',
                        version: '1.0',
                    },
                }
            ),
            storeService.createStore(
                user10,
                'Block',
                'pcol_blocks',
                'https://images.hamza.market/headphones.webp',
                410,
                'Block Store - Specializing in building blocks and construction toys. Let your creativity soar with our range of products designed for endless fun.',
                {
                    11155111: {
                        address: '0x77930414Ba3E8f8799A9e503d2E6A9CBC95F42B6',
                        version: '1.0',
                    },
                    80002: {
                        address: '0xEb6b6144B0DDC6494FB7483D209ecc41A7Ae2Cc5',
                        version: '1.0',
                    },
                }
            ),
            storeService.createStore(
                user11,
                'Gift Cards',
                'pcol_giftcards',
                'https://images.hamza.market/giftcards.webp',
                110,
                'Gift Cards of all kinds & varieties and types and things.',
                {
                    11155111: {
                        address: '0x77930414Ba3E8f8799A9e503d2E6A9CBC95F42B6',
                        version: '1.0',
                    },
                    80002: {
                        address: '0xEb6b6144B0DDC6494FB7483D209ecc41A7Ae2Cc5',
                        version: '1.0',
                    },
                }
            ),
        ]);
        const [
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
            store11,
        ] = stores;

        const collectionIds = [
            'pcol_01HRVF8HCVY8B00RF5S54THTPC',
            'pcol_01HSGAM4918EX0DETKY6E662WT',
            'pcol_01HSGAMXDJD725MR3VSW631SN2',
            'pcol_01HSGAMXDJD725MR3VSW631DR0',
            'pcol_01HSGAMXDJD725MR3VSW63LEG0',
            'pcol_01HSGAMXDJD725MR3VSW63B0RD',
            'pcol_01HSGAMXDJD725MR3VSW63W0GE',
            'pcol_01HSGAMXDJD725MR3VSW63W0GA',
            //'pcol_shake',
            'pcol_lighting',
            'pcol_01HSGAMXDJD725MR3VSW63LEG0',
        ];

        const storeIds = [
            store0.id,
            store1.id,
            store2.id,
            store3.id,
            store4.id,
            store5.id,
            store6.id,
            store7.id,
            //store8.id,
            store9.id,
            store10.id,
            store11.id,
        ];

        const promises = [];
        for (let n = 0; n < collectionIds.length; n++) {
            promises.push(
                productCollectionService.update(collectionIds[n], {
                    store_id: storeIds[n],
                })
            );
        }

        await Promise.all(promises);

        //sort the products into their houses of Gryffindor, Hufflepuff, etc.
        for (let collectionId of collectionIds) {
            const collection: ProductCollection =
                await productCollectionService.retrieve(collectionId, {
                    relations: ['products'],
                });

            if (collection) {
                for (let product of collection.products) {
                    product.store_id = collection.store_id;
                }
                await productRepository.save(collection.products);
            }
        }

        //add shipping spec for each store
        for (let store of stores) {
            const randomPrice = randomInt(2) + 1;
            await shippingSpecRepository.save({
                id: 'shipspec_' + store.id.replace('store_', ''),
                store_id: store.id,
                spec: { fixed_price_usd: randomPrice * 100 },
            });
        }

        return res.json({});
    });
};
