'use client';

import { ethers, BigNumberish, TransactionResponse } from 'ethers';
import { getCurrencyPrecision } from '@/currency.config';
import { getCurrencyAddress } from '@/currency.config';
import { getContractAddress } from '@/contracts.config';
import {
    IWalletPaymentHandler,
    CheckoutData,
    WalletPaymentResponse,
    checkWalletBalance,
    getTokenContract,
} from './common';

/**
 * Wallet payment handler for 'direct' checkout strategy, sends payment directly to an
 * address.
 */
export class DirectWalletPaymentHandler implements IWalletPaymentHandler {
    async doWalletPayment(
        provider: ethers.Provider | null,
        signer: ethers.Signer | null,
        chainId: any,
        data: CheckoutData
    ): Promise<WalletPaymentResponse> {
        console.log('DirectWalletPaymentHandler.doWalletPayment');
        const recipient: string = getContractAddress('dao', chainId);
        console.log('dao address is ', recipient);

        const paymentGroups = this.createPaymentGroups(data, chainId);
        let transaction_id = '';
        let payer_address = '';
        let receiver_address = data.orders[0].wallet_address;

        if (signer && provider) {
            for (const currency in paymentGroups) {
                let tx: ethers.TransactionResponse | null = null;
                let amount = this.convertToNativeAmount(
                    currency,
                    paymentGroups[currency],
                    chainId
                );
                console.log('amount is', amount);

                amount = process.env.NEXT_PUBLIC_ONE_SATOSHI_DISCOUNT
                    ? BigInt(1)
                    : amount;

                //check balance first
                if (
                    !(await checkWalletBalance(
                        provider,
                        signer,
                        chainId,
                        currency,
                        amount
                    ))
                ) {
                    return {
                        transaction_id,
                        payer_address,
                        success: false,
                        chain_id: chainId,
                        message: 'Insufficient balance',
                    };
                }

                //handle native payment
                if (currency === 'eth') {
                    tx = await signer.sendTransaction({
                        to: recipient,
                        value: amount,
                    });
                }

                //handle token payment
                else {
                    const currencyAddr = getCurrencyAddress(currency, chainId);
                    const token = getTokenContract(signer, currencyAddr);
                    console.log(
                        `calling ${currencyAddr}.transfer(${recipient}, ${amount})`
                    );

                    if (token) {
                        tx = await token.transfer(recipient, amount);
                    }
                }

                //wait for tx to be confirmed
                if (tx) {
                    transaction_id = tx.hash;
                    await tx.wait();
                }
            }

            payer_address = await signer.getAddress();
        } else {
            if (!signer) console.log('NO SIGNER');
            if (!provider) console.log('NO PROVIDER');
        }

        const output = {
            transaction_id,
            payer_address,
            chain_id: chainId,
            success: transaction_id && transaction_id.length ? true : false,
        };

        console.log('returning output: ', JSON.stringify(output));
        return output;
    }

    private createPaymentGroups(
        data: any,
        chainId: number
    ): { [key: string]: BigNumberish } {
        const output: { [key: string]: BigNumberish } = {};

        if (data.orders) {
            data.orders.forEach((o: any) => {
                let currency = o.currency_code;
                if (!currency?.length) currency = 'eth';

                let amount = o.amount;

                if (output[currency]) amount += output[currency];

                output[currency] = amount;
            });

            return output;
        }
        return {};
    }

    private convertToNativeAmount(
        currency: string,
        amount: BigNumberish,
        chainId: number
    ) {
        const precision = getCurrencyPrecision(currency, chainId);
        const adjustmentFactor = Math.pow(10, precision.native - precision.db);
        const nativeAmount = BigInt(amount) * BigInt(adjustmentFactor);
        return ethers.toBigInt(nativeAmount);
    }
}
