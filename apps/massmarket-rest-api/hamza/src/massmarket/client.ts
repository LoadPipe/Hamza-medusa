import { RelayClient } from '@massmarket/client';
import { randomBytes } from 'crypto';
import {
    http,
    createWalletClient,
    PrivateKeyAccount,
    bytesToHex,
    keccak256,
    hexToBytes,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { sleep, HexString } from '../utils.js';

/**
 * Wrapper for the massmarket relay client, exposing those functions and properties
 * that we need for our specific use cases.
 */
export class RelayClientWrapper {
    private _client: RelayClient;
    private _chain = sepolia;
    private _keyCard: Uint8Array;
    private _listening: boolean = false;
    readonly shopId: HexString;
    eventStream: ReadableStream<any> | null = null;

    constructor(
        endpoint: string,
        shopId: HexString = '0x0',
        keyCardPrivKey: HexString = '0x0',
        keyCardEnrolled: boolean = true
    ) {
        this.shopId = shopId;
        if (keyCardPrivKey?.length === 0 || keyCardPrivKey === '0x0') {
            this._keyCard = new Uint8Array(randomBytes(32));
            keyCardPrivKey = bytesToHex(this._keyCard);
            keyCardEnrolled = false;
        } else {
            this._keyCard = hexToBytes(keyCardPrivKey);
        }

        const keyCardWallet: PrivateKeyAccount =
            privateKeyToAccount(keyCardPrivKey);

        const args = {
            relayEndpoint: `wss://${endpoint}`,
            keyCardWallet,
        };

        this._client = new RelayClient(args);
    }

    static randomshopId(): HexString {
        return bytesToHex(new Uint8Array(randomBytes(32)));
    }

    /**
     * Gets an instance from cache, if one exists. Otherwise, creates a new instance
     * and caches it.
     * @param endpoint
     * @param shopId
     * @param keycard
     * @returns
     */
    static async get(
        endpoint: string,
        shopId: HexString,
        keycard: HexString
    ): Promise<RelayClientWrapper> {
        //return from cache
        if (cache.contains(shopId)) {
            return cache.get(shopId);
        }

        //create instance and cache it
        const instance: RelayClientWrapper = new RelayClientWrapper(
            endpoint,
            shopId,
            keycard
        );

        cache.add(shopId, instance);
        return instance;
    }

    /**
     * Creates a new store, authenticates, and returns a RelayClientWrapper instance.
     *
     * @param endpoint Relay endpoint e.g. 'wss://relay.endpoint.com'
     * @param shopId Unique store ID; this will error if not unique.
     * @param walletPrivKey Store owner's wallet private key, as 0x{string}
     * @returns a RelayClientWrapper instance.
     */
    static async create(
        endpoint: string,
        shopId: HexString = '0x0',
        walletPrivKey: HexString
    ): Promise<RelayClientWrapper> {
        const client: RelayClientWrapper = new RelayClientWrapper(
            endpoint,
            shopId
        );

        const account: PrivateKeyAccount = privateKeyToAccount(walletPrivKey);

        const wallet = createWalletClient({
            account,
            chain: sepolia,
            transport: http(),
        });

        cache.add(shopId, client);

        return client;
    }

    /**
     * Creates a new store with a random shopId, enrolls a keycard, and writes the manifest.
     * @returns The store id and keycard value for the new store.
     */
    static async createAndInitializeStore(
        endpoint: string,
        walletPrivKey: HexString
    ): Promise<{
        shopId: HexString;
        keyCard: HexString;
    }> {
        //create random store id
        const shopId = bytesToHex(randomBytes(32));

        //create random keycard
        const keycardBytes = randomBytes(32);
        const keycardString = bytesToHex(keycardBytes);
        const keycard: {
            bytes: Buffer;
            string: HexString;
            wallet: PrivateKeyAccount;
        } = {
            bytes: keycardBytes,
            string: keycardString,
            wallet: privateKeyToAccount(keycardString),
        };

        //create relay client instance
        console.log('create relay client');
        const client = new RelayClient({
            relayEndpoint: `wss://${endpoint}`,
            //shopId,
            keyCardWallet: keycard.wallet,
            //keyCardEnrolled: false,
        });

        //create actual (store) wallet
        const account: PrivateKeyAccount = privateKeyToAccount(walletPrivKey);

        const storeWallet = createWalletClient({
            account,
            chain: sepolia,
            transport: http(),
        });

        //create store
        console.log('create store');
        console.log('shopId', shopId);
        console.log('keycard', keycard.string);

        const shopToken = '0x0'; //await client.blockchain.createShop(storeWallet);

        console.log('waiting...');
        await sleep(45);

        //enroll keycard
        console.log('enrolling KC');
        //await client.enrollKeycard(storeWallet, false, shopId); //this uses store wallet

        console.log('writing manifest');
        await client.shopManifest(
            {
                name: 'test shop',
                description: 'test shop is the best shop',
                profilePictureUrl: 'https://http.cat/images/200.jpg',
                publishedTagId: randomBytes(32),
            },
            shopId
        );

        await sleep(25);
        console.log('setting currency 1');
        await client.updateShopManifest({
            addAcceptedCurrency: {
                chainId: 11155111,
                tokenAddr: hexToBytes(
                    '0x822585D682B973e4b1B47C0311f162b29586DD02'
                ),
            },
        });
        console.log('setting currency 2');
        await client.updateShopManifest({
            addAcceptedCurrency: {
                chainId: 11155111,
                tokenAddr: hexToBytes(
                    '0xbe9fe9b717c888a2b2ca0a6caa639afe369249c5'
                ),
            },
        });
        console.log('setting currency 3');
        await client.updateShopManifest({
            addAcceptedCurrency: {
                chainId: 11155111,
                tokenAddr: hexToBytes(
                    '0x0000000000000000000000000000000000000000'
                ),
            },
        });

        console.log('setting payee');
        await client.updateShopManifest({
            addPayee: {
                chainId: 11155111,
                addr: hexToBytes('0x74b7284836F753101bD683C3843e95813b381f18'),
                name: 'hamza-switch',
                callAsContract: true,
            },
        });

        //add to cache
        cache.add(
            shopId,
            new RelayClientWrapper(endpoint, shopId, keycard.string)
        );

        return {
            keyCard: keycard.string,
            shopId,
        };
    }

    /**
     * Authenticates to an already existing store.
     *
     * @param endpoint Relay endpoint e.g. 'wss://relay.endpoint.com'
     * @param shopId Unique store ID.
     * @param keyCard Private key in the form 0x{hex}
     * @returns a RelayClientWrapper instance.
     */
    static async getInstance(
        endpoint: string,
        shopId: HexString = '0x0',
        keyCard: HexString
    ): Promise<RelayClientWrapper> {
        const client: RelayClientWrapper = new RelayClientWrapper(
            endpoint,
            shopId,
            keyCard
        );
        return client;
    }

    static async enrollNewKeycard(
        endpoint: string,
        shopId: HexString,
        privateKey: HexString
    ): Promise<HexString> {
        const rc = new RelayClientWrapper(endpoint, shopId, '0x0', false);
        await rc.enrollKeycard(privateKey);
        return rc.keyCardToString();
    }

    async getCartFinalizedEvent(cartId: HexString): Promise<any> {
        if (!this.eventStream) {
            this.eventStream = await this._client.createEventStream();
        }

        //split the streams; read from one, and save the other
        const streams = this.eventStream?.tee();
        console.log('stream locked: ', streams[0]?.locked);

        return await new Promise(async (resolve, reject) => {
            //time out; if no events received after some number of seconds, return
            setTimeout(() => {
                this.eventStream = streams[1];
                resolve(null);
            }, 3000);

            //read the events
            for await (const event of streams[0]) {
                //this particular one is the finalized event
                if (event.event?.updateOrder?.itemsFinalized) {
                    if (
                        //check the cart id
                        bytesToHex(
                            event.event?.updateOrder?.itemsFinalized.orderHash
                        ) == keccak256(hexToBytes(cartId))
                    ) {
                        //return the event
                        console.log(event.event?.updateOrder?.itemsFinalized);
                        this.eventStream = streams[1];
                        resolve(event?.event.updateOrder?.itemsFinalized);
                    }
                }
            }

            this.eventStream = streams[1];
            resolve(null);
        });
    }

    async startListeningForEvents(): Promise<void> {
        this._listening = true;

        while (this._listening) {
            console.log('listening...');
            if (!this.eventStream) {
                console.log('creating event stream');
                this.eventStream = await this._client.createEventStream();
            }

            const streams = this.eventStream?.tee();
            console.log('stream locked: ', streams[0]?.locked);
            await new Promise(async (resolve, reject) => {
                setTimeout(() => {
                    this.eventStream = streams[1];
                    resolve(null);
                }, 10000);

                for await (const event of streams[0]) {
                    console.log(event);
                }

                this.eventStream = streams[1];
                resolve(null);
            });
        }
    }

    async stopListening(): Promise<void> {
        this._listening = false;
    }

    keyCardToString(): HexString {
        return bytesToHex(this._keyCard);
    }

    async connect(): Promise<void> {
        await this._client.connect();
    }

    async disconnect(): Promise<void> {
        await this._client.disconnect();
    }

    async enrollKeycard(
        walletPrivKey: HexString,
        guest: boolean = false
    ): Promise<void> {
        const account: PrivateKeyAccount = privateKeyToAccount(walletPrivKey);

        const storeWallet = createWalletClient({
            account,
            chain: sepolia,
            transport: http(),
        });

        await this._client.enrollKeycard(storeWallet, guest, this.shopId);
    }

    async createCart(): Promise<HexString> {
        return bytesToHex(await this._client.createOrder());
    }

    async createProduct(product: ProductConfig): Promise<HexString> {
        let id: HexString = '0x0';
        try {
            const metadata = new TextEncoder().encode(
                JSON.stringify({
                    name: product.name,
                    description: product.description,
                    image: product.image,
                })
            );
            id = bytesToHex(
                await this._client.createItem({
                    price: product.price,
                    metadata,
                })
            );
            //await this._client.changeStock();
        } catch (e) {
            console.error(e);
        }
        return id;
    }

    async addToCart(
        cartId: HexString,
        productId: HexString,
        quantity: number = 1
    ) {
        await this._client.changeStock({
            itemIds: [hexToBytes(productId)],
            diffs: [10],
        });
        //console.log(await this._client.changeCart(cartId, productId, quantity));
        await this._client.updateOrder({
            orderId: hexToBytes(cartId),
            changeItems: { itemId: hexToBytes(productId), quantity },
        });
    }

    async commitCart(cartId: HexString, tokenAddress: HexString | null = null) {
        const input: {
            orderId: any;
            payeeName: string;
            currency: { tokenAddr: any; chainId: number } | null;
        } = {
            orderId: hexToBytes(cartId),
            payeeName: 'hamza-switch',
            currency: null,
        };
        if (tokenAddress) {
            input.currency = {
                tokenAddr: hexToBytes(tokenAddress),
                chainId: 11155111,
            };
        }

        return await this._client.commitOrder(input);
    }

    async setErc20(address: HexString) {
        const pb = await this._client.updateShopManifest({
            addAcceptedCurrency: {
                chainId: 11155111,
                tokenAddr: hexToBytes(address),
            },
        });
    }

    async setPayee(name: string, address: HexString) {
        const pb = await this._client.updateShopManifest({
            addPayee: {
                chainId: 11155111,
                addr: hexToBytes(address),
                name,
                callAsContract: true,
            },
        });
    }

    private async readStream(
        reader: ReadableStreamDefaultReader<Uint8Array>
    ): Promise<void> {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            console.log('Received data:', new TextDecoder().decode(value));
        }
        console.log('Stream has been fully read.');
    }
}

/**
 * Caches instances by id. The purpose is that one instance per store exists in
 * memory, at most.
 */
class RelayClientCache {
    private clients: { [key: string]: RelayClientWrapper } = {};

    constructor() {
        this.clear();
    }

    contains(id: HexString): boolean {
        return this.clients[id] ? true : false;
    }

    add(id: HexString, instance: RelayClientWrapper) {
        console.log(`adding instance ${id} to cache`);
        this.clients[id] = instance;
    }

    get(id: HexString): RelayClientWrapper {
        console.log(`getting instance ${id} from cache`);
        return this.clients[id];
    }

    remove(id: HexString) {
        delete this.clients[id];
    }

    clear() {
        this.clients = {};
    }
}

/**
 * Type for defining item listings/products.
 */
export type ProductConfig = {
    name: string;
    price: string;
    description: string;
    image: string;
};

const cache: RelayClientCache = new RelayClientCache();
