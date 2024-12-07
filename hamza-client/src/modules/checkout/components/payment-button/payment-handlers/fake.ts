'use client';

import { ethers, BigNumberish, TransactionResponse } from 'ethers';
import {
    IWalletPaymentHandler,
    CheckoutData,
    WalletPaymentResponse,
} from './common';

/**
 * Wallet payment handler for 'fake' checkout strategy, which is just a mimic of an
 * actual checkout but disregards real amounts, seller wallets, etc. Just for show.
 * Does interact with the wallet though.
 */
export class FakeWalletPaymentHandler implements IWalletPaymentHandler {
    async doWalletPayment(
        provider: ethers.Provider | null,
        signer: ethers.Signer | null,
        chainId: any,
        data: CheckoutData
    ): Promise<WalletPaymentResponse> {
        let transaction_id = '';
        let payer_address = '';
        let receiver_address = data.orders[0].wallet_address;

        if (signer) {
            const tx = await signer.sendTransaction({
                to: '0x5bacAdf2F9d9C62D2696f93ede5a22041a9AeE0D',
                value: data.orders[0].amount,
            });

            console.log(tx);
            transaction_id = tx.hash;
            payer_address = await signer.getAddress();
        }

        return {
            escrow_address: '0x0',
            transaction_id,
            payer_address,
            receiver_address,
            chain_id: chainId,
            success: transaction_id && transaction_id.length ? true : false,
        };
    }
}
