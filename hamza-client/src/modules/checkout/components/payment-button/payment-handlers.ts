'use client';

import { ITransactionOutput, IMultiPaymentInput } from 'web3';
import { MassmarketPaymentClient } from 'web3/massmarket-payment';
import { ethers, BigNumberish } from 'ethers';
import { getCurrencyPrecision } from 'currency.config';
import {
    getMassmarketPaymentAddress,
    getMasterSwitchAddress,
} from 'contracts.config';

export type WalletPaymentResponse = {
    transaction_id: string;
    payer_address: string;
    escrow_contract_address: string;
    success: boolean;
};

export interface IWalletPaymentHandler {
    doWalletPayment(
        provider: ethers.Provider,
        signer: ethers.Signer,
        chainId: any,
        data: any
    ): Promise<WalletPaymentResponse>;
}

export class MassmarketWalletPaymentHandler implements IWalletPaymentHandler {
    async doWalletPayment(
        provider: ethers.Provider,
        signer: ethers.Signer,
        chainId: any,
        data: any
    ): Promise<WalletPaymentResponse> {
        const escrow_contract_address = getMasterSwitchAddress(chainId);

        const paymentContractAddr =
            getMassmarketPaymentAddress(chainId);
        const paymentClient: MassmarketPaymentClient =
            new MassmarketPaymentClient(
                provider,
                signer,
                paymentContractAddr,
                escrow_contract_address
            );

        console.log('payment address:', paymentContractAddr);
        console.log('escrow address:', escrow_contract_address);

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
        const transaction_id = output.transaction_id;
        const payer_address = output.receipt.from;

        return {
            transaction_id,
            payer_address,
            escrow_contract_address,
            success:
                transaction_id && transaction_id.length ? true : false,
        };
    }

    private createPaymentInput(
        data: any,
        payer: string,
        chainId: number
    ) {
        if (data.orders) {
            const paymentInput: IMultiPaymentInput[] = [];
            data.orders.forEach((o: any) => {
                //o.amount = o.massmarket_amount; // translateToNativeAmount(o, chainId);
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

    private translateToNativeAmount(order: any, chainId: number) {
        const { amount, currency_code } = order;
        const precision = getCurrencyPrecision(currency_code, chainId);
        const adjustmentFactor = Math.pow(10, precision.native - precision.db);
        const nativeAmount = BigInt(amount) * BigInt(adjustmentFactor);
        return ethers.toBigInt(nativeAmount);
    };
}

export class FakeWalletPaymentHandler implements IWalletPaymentHandler {
    async doWalletPayment(
        provider: ethers.Provider,
        signer: ethers.Signer,
        chainId: any,
        data: any
    ): Promise<WalletPaymentResponse> {
        const tx = await signer.sendTransaction({
            to: '0x5bacAdf2F9d9C62D2696f93ede5a22041a9AeE0D',
            value: data.orders[0].amount,
        });

        console.log(tx);
        const transaction_id = tx.hash;
        const payer_address = await signer.getAddress();

        return {
            escrow_contract_address: '0x0',
            transaction_id,
            payer_address,
            success:
                transaction_id && transaction_id.length ? true : false,
        }
    }
}

export class SwitchWalletPaymentHandler implements IWalletPaymentHandler {
    async doWalletPayment(
        provider: ethers.Provider,
        signer: ethers.Signer,
        chainId: any,
        data: any
    ): Promise<WalletPaymentResponse> {
        return {
            escrow_contract_address: '',
            payer_address: '',
            transaction_id: '',
            success: false
        };
    }
}