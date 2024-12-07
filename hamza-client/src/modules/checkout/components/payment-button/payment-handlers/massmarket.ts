'use client';

import { IMultiPaymentInput } from '@/web3';
import { MassmarketPaymentClient } from '@/web3/contracts/massmarket-payment';
import { ethers } from 'ethers';
import { getCurrencyPrecision } from '@/currency.config';
import {
    getMassmarketPaymentAddress,
    getMasterSwitchAddress,
} from '@/contracts.config';
import {
    IWalletPaymentHandler,
    CheckoutData,
    WalletPaymentResponse,
    checkWalletBalance,
} from './common';

/**
 * Wallet payment handler for use with the Massmarket checkout mode. It calls to the
 * Massmarket smart contract to process a payment.
 */
export class MassmarketWalletPaymentHandler implements IWalletPaymentHandler {
    async doWalletPayment(
        provider: ethers.Provider | null,
        signer: ethers.Signer | null,
        chainId: any,
        data: CheckoutData
    ): Promise<WalletPaymentResponse> {
        const escrow_address = getMasterSwitchAddress(chainId);
        let transaction_id = '';
        let payer_address = '';
        let receiver_address = data.orders[0].wallet_address;

        if (provider && signer) {
            const paymentContractAddr = getMassmarketPaymentAddress(chainId);
            const paymentClient: MassmarketPaymentClient =
                new MassmarketPaymentClient(
                    provider,
                    signer,
                    paymentContractAddr,
                    escrow_address
                );

            console.log('payment address:', paymentContractAddr);
            console.log('escrow address:', escrow_address);

            //create the inputs
            const paymentInput: IMultiPaymentInput[] =
                await this.createPaymentInput(
                    data,
                    await signer.getAddress(),
                    chainId
                );

            console.log('payment input: ', paymentInput);

            //send payment to contract
            const output = await paymentClient.pay(paymentInput);

            console.log(output);
            transaction_id = output.transaction_id;
            payer_address = output.receipt.from;
        }

        return {
            transaction_id,
            payer_address,
            receiver_address,
            escrow_address,
            chain_id: chainId,
            success: transaction_id && transaction_id.length ? true : false,
        };
    }

    private createPaymentInput(data: any, payer: string, chainId: number) {
        if (data.orders) {
            const paymentInput: IMultiPaymentInput[] = [];
            data.orders.forEach((o: any) => {
                //o.amount = o.massmarket_amount; // convertToNativeAmount(o, chainId);
                const input: IMultiPaymentInput = {
                    currency: o.currency_code,
                    receiver: o.wallet_address,
                    payments: [
                        {
                            id: o.massmarket_order_id,
                            payer: payer,
                            massmarketAmount: o.massmarket_amount,
                            currency: o.currency_code,
                            receiver: data.wallet_address,
                            massmarketOrderId: o.massmarket_order_id,
                            storeId: o.orders[0].store.massmarket_store_id,
                            chainId,
                            amount: o.amount,
                            orderId: o.id,
                            massmarketTtl: o.massmarket_ttl,
                        },
                    ],
                };
                paymentInput.push(input);
            });

            return paymentInput;
        }
        return [];
    }

    private convertToNativeAmount(order: any, chainId: number) {
        const { amount, currency_code } = order;
        const precision = getCurrencyPrecision(currency_code, chainId);
        const adjustmentFactor = Math.pow(10, precision.native - precision.db);
        const nativeAmount = BigInt(amount) * BigInt(adjustmentFactor);
        return ethers.toBigInt(nativeAmount);
    }
}
