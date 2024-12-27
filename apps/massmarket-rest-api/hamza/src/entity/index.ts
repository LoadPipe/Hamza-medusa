import { Hex } from '../../node_modules/viem/_types/index';

export type HexString = `0x${string}`;

export interface ICreateStoreInput {
    storeId: HexString;
    keycard: HexString;
}

export interface ICreateStoreOutput {
    storeId: HexString;
    keyCard: HexString;
    success: boolean;
}

export interface ICreateCartInput {
    storeId: HexString;
    keycard: HexString;
}

export interface ICreateCartOutput {
    cartId: HexString;
    success: boolean;
}

export interface IAddCartItemInput {
    storeId: HexString;
    keycard: HexString;
    item: IAddItemInput;
}

export interface IAddCartItemOutput {
    success: boolean;
}

export interface IAbandonCartInput {
    storeId: HexString;
    keycard: HexString;
}

export interface IAbandonCartOutput {
    success: boolean;
}

export interface ICommitCartInput {
    storeId: HexString;
    keycard: HexString;
    paymentCurrency?: HexString;
}

export interface ICommitCartOutput {
    success: boolean;
}

export interface IProductInput {
    name: string;
    price: string;
    description: string;
    image: string;
}

export interface ICreateProductInput {
    storeId: HexString;
    keycard: HexString;
    products: IProductInput[];
}

export interface ICreateProductOutput {
    productIds: HexString[];
    success: boolean;
}

export interface IUpdateProductInput {
    storeId: HexString;
    keycard: HexString;
    productId: HexString;
    name: string;
    price: string;
    description: string;
    image: string;
}

export interface IUpdateProductOutput {
    success: boolean;
}

export interface IAddItemInput {
    productId: HexString;
    quantity: number;
}

export interface ICheckoutInput {
    storeId: HexString;
    keycard: HexString;
    paymentCurrency?: HexString;
    items: IAddItemInput[];
}

export interface ICheckoutOutput {
    success: boolean;
    contractAddress: HexString;
    payeeAddress: HexString;
    paymentId: HexString;
    isPaymentEndpoint: boolean;
    orderHash: HexString;
    amount: string;
    chainId: number;
    ttl: number;
    currency: string;
}
