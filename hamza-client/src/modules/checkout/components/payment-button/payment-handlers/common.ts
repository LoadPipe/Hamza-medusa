'use client';

import { getCurrencyAddress } from '@/currency.config';
import { erc20abi } from '@/web3/abi/erc20-abi';
import { BigNumberish, ethers } from 'ethers';

export type WalletPaymentResponse = {
    transaction_id: string;
    payer_address: string;
    receiver_address: string;
    escrow_address: string;
    message?: string;
    chain_id: number;
    success: boolean;
};

export type CheckoutOrderData = {
    order_id: string;
    cart_id: string;
    wallet_address: string;
    escrow_metadata: any;
    currency_code: string;
    amount: string;
    massmarket_amount: string;
    massmarket_order_id: string;
    massmarket_ttl: string;
};

// checkout data retrieved from server, to help in creating blockchain payments
export type CheckoutData = {
    orders: CheckoutOrderData[];
};

/**
 * Interface for a wallet payment handling strategy. The right strategy will be chosen based on
 * the checkout mode that's prescribed by the server.
 */
export interface IWalletPaymentHandler {
    doWalletPayment(
        provider: ethers.Provider | null,
        signer: ethers.Signer | null,
        chainId: any,
        data: CheckoutData
    ): Promise<WalletPaymentResponse>;
}

/**
 * Gets the token contract corresponding to the given address, and stores it
 * for later.
 *
 * @param address An ERC20 token address
 * @returns An ethers.Contract object
 */
export function getTokenContract(
    signer: ethers.Signer,
    address: string
): ethers.Contract {
    return new ethers.Contract(address, erc20abi, signer);
}

export async function checkWalletBalance(
    provider: ethers.Provider,
    signer: ethers.Signer,
    chainId: any,
    currencyCode: string,
    amount: bigint
): Promise<boolean> {
    const address = await signer.getAddress();
    const currencyAddress = getCurrencyAddress(currencyCode, chainId);
    if (currencyAddress == ethers.ZeroAddress) {
        return amount <= BigInt(await provider.getBalance(address));
    } else {
        const token = getTokenContract(signer, currencyAddress);
        const balance = await token.balanceOf(address);
        return balance >= amount;
    }
    return false;
}
