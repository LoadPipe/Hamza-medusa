'use client';

import { ethers, BigNumberish, TransactionResponse } from 'ethers';
import { getCurrencyPrecision } from '@/currency.config';
import { getContractAddress } from '@/contracts.config';
import { LiteSwitchClient } from '@/web3/contracts/lite-switch';
import { ISwitchMultiPaymentInput } from '@/web3';
import {
    IWalletPaymentHandler,
    CheckoutData,
    WalletPaymentResponse,
    checkWalletBalance,
} from './common';

/**
 * Wallet payment handler for 'switch' checkout strategy, using the 'lite' version
 * of the switch.
 */
export class LiteSwitchWalletPaymentHandler implements IWalletPaymentHandler {
    async doWalletPayment(
        provider: ethers.Provider | null,
        signer: ethers.Signer,
        chainId: any,
        data: CheckoutData
    ): Promise<WalletPaymentResponse> {
        const contractAddress = getContractAddress('lite_switch', chainId);
        let transaction_id = '';
        let payer_address = '';
        let receiver_address = data.orders[0].wallet_address;

        if (provider) {
            const client: LiteSwitchClient = new LiteSwitchClient(
                provider,
                signer,
                contractAddress
            );

            payer_address = await signer.getAddress();
            const inputs = this.createPaymentInput(
                data,
                payer_address,
                chainId
            );
            console.log('sending payments: ', inputs);

            //check balance first
            const currencyPayments = this.groupPaymentsByCurrency(inputs);
            for (let cp of currencyPayments) {
                const { currency, amount } = cp;
                if (
                    !(await checkWalletBalance(
                        provider,
                        signer,
                        chainId,
                        currency,
                        amount as bigint
                    ))
                ) {
                    return {
                        transaction_id,
                        payer_address,
                        success: false,
                        chain_id: chainId,
                        message: `Wallet has an insufficient balance in ${currency.toUpperCase()} to pay for this transaction`,
                    };
                }
            }

            const tx = await client.placeMultiplePayments(inputs, true);
            transaction_id = tx.transaction_id;
        }

        return {
            payer_address,
            transaction_id,
            chain_id: chainId,
            success: transaction_id && transaction_id.length ? true : false,
        };
    }

    private createPaymentInput(data: any, payer: string, chainId: any) {
        if (data.orders) {
            const paymentInput: ISwitchMultiPaymentInput[] = [];
            data.orders.forEach((o: any) => {
                const input: ISwitchMultiPaymentInput = {
                    currency: o.currency_code,
                    payments: [
                        {
                            id: 1, //o.order_id,
                            orderId: o.order_id,
                            payer: payer,
                            receiver: o.wallet_address,
                            amount: process.env.NEXT_PUBLIC_ONE_SATOSHI_DISCOUNT
                                ? 1
                                : this.convertToNativeAmount(
                                      o.currency_code,
                                      o.amount,
                                      chainId
                                  ),
                        },
                    ],
                };
                paymentInput.push(input);
            });

            return paymentInput;
        }
        return [];
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

    private groupPaymentsByCurrency(
        inputs: ISwitchMultiPaymentInput[]
    ): { currency: string; amount: BigInt }[] {
        const output: { currency: string; amount: BigInt }[] = [];
        for (let input of inputs) {
            let existing = output.find((o) => o.currency == input.currency);
            if (!existing) {
                existing = { currency: input.currency, amount: BigInt(0) };
                output.push(existing);
            }

            for (let payment of input.payments) {
                let amt: any = existing.amount;
                amt += BigInt(payment.amount);
                existing.amount = amt;
            }
        }

        return output;
    }
}
