'use client';

import { ITransactionOutput, IMultiPaymentInput } from 'web3';
import { MassmarketPaymentClient } from 'web3/contracts/massmarket-payment';
import { ethers, BigNumberish, TransactionResponse } from 'ethers';
import { getCurrencyPrecision } from 'currency.config';
import {
    getMassmarketPaymentAddress,
    getMasterSwitchAddress,
} from 'contracts.config';
import { getCurrencyAddress } from 'currency.config';
import { getContractAddress } from 'contracts.config';
import { erc20abi } from '../../../../web3/abi/erc20-abi';
import { LiteSwitchClient } from 'web3/contracts/lite-switch';
import { ISwitchMultiPaymentInput } from 'web3';

export type WalletPaymentResponse = {
    transaction_id: string;
    payer_address: string;
    escrow_contract_address: string;
    success: boolean;
};

/**
 * Interface for a wallet payment handling strategy. The right strategy will be chosen based on 
 * the checkout mode that's prescribed by the server. 
 */
export interface IWalletPaymentHandler {
    doWalletPayment(
        provider: ethers.Provider | null,
        signer: ethers.Signer,
        chainId: any,
        data: any
    ): Promise<WalletPaymentResponse>;
}

/**
 * Gets the token contract corresponding to the given address, and stores it
 * for later.
 *
 * @param address An ERC20 token address
 * @returns An ethers.Contract object
 */
function getTokenContract(signer: ethers.Signer, address: string): ethers.Contract {
    return new ethers.Contract(address, erc20abi, signer);
}

/**
 * Wallet payment handler for use with the Massmarket checkout mode. It calls to the 
 * Massmarket smart contract to process a payment. 
 */
export class MassmarketWalletPaymentHandler implements IWalletPaymentHandler {
    async doWalletPayment(
        provider: ethers.Provider | null,
        signer: ethers.Signer,
        chainId: any,
        data: any
    ): Promise<WalletPaymentResponse> {
        const escrow_contract_address = getMasterSwitchAddress(chainId);
        let transaction_id = '';
        let payer_address = '';

        if (provider) {
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
            transaction_id = output.transaction_id;
            payer_address = output.receipt.from;
        }

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

/**
 * Wallet payment handler for 'fake' checkout strategy, which is just a mimic of an 
 * actual checkout but disregards real amounts, seller wallets, etc. Just for show.
 * Does interact with the wallet though. 
 */
export class FakeWalletPaymentHandler implements IWalletPaymentHandler {
    async doWalletPayment(
        provider: ethers.Provider | null,
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

/**
 * Wallet payment handler for 'switch' checkout strategy, using the 'lite' version 
 * of the switch. 
 */
export class LiteSwitchWalletPaymentHandler implements IWalletPaymentHandler {
    async doWalletPayment(
        provider: ethers.Provider | null,
        signer: ethers.Signer,
        chainId: any,
        data: any
    ): Promise<WalletPaymentResponse> {
        const contractAddress = getContractAddress('lite_switch', chainId);
        let transaction_id = '';
        let payer_address = '';

        if (provider) {
            const client: LiteSwitchClient = new LiteSwitchClient(
                provider,
                signer,
                contractAddress
            );

            payer_address = await signer.getAddress();
            const inputs = this.createPaymentInput(data, payer_address);

            const tx = await client.placeMultiplePayments(inputs, false);
            transaction_id = tx.transaction_id;
        }

        return {
            escrow_contract_address: contractAddress,
            payer_address,
            transaction_id,
            success:
                transaction_id && transaction_id.length ? true : false,
        };
    }

    private createPaymentInput(
        data: any,
        payer: string
    ) {
        if (data.orders) {
            const paymentInput: ISwitchMultiPaymentInput[] = [];
            data.orders.forEach((o: any) => {
                const input: ISwitchMultiPaymentInput = {
                    currency: o.currency_code,
                    receiver: o.wallet_address,
                    payments: [
                        {
                            id: 1, //o.order_id,
                            payer: payer,
                            receiver: o.wallet_address,
                            amount: o.amount,
                        },
                    ],
                };
                paymentInput.push(input);
            });

            return paymentInput;
        }
        return [];
    }
}

/**
 * Wallet payment handler for 'switch' checkout strategy, sends payment to the Hamza
 * 'switch' escrow contract. 
 */
export class SwitchWalletPaymentHandler implements IWalletPaymentHandler {
    async doWalletPayment(
        provider: ethers.Provider | null,
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

/**
 * Wallet payment handler for 'direct' checkout strategy, sends payment directly to an 
 * address. 
 */
export class DirectWalletPaymentHandler implements IWalletPaymentHandler {
    async doWalletPayment(
        provider: ethers.Provider | null,
        signer: ethers.Signer,
        chainId: any,
        data: any
    ): Promise<WalletPaymentResponse> {
        console.log('DirectWalletPaymentHandler.doWalletPayment');
        const recipient: string = getContractAddress('lite_switch', chainId);

        const paymentGroups = this.createPaymentGroups(data, chainId);
        let transaction_id = '';

        for (const currency in paymentGroups) {
            let tx: ethers.TransactionResponse | null = null;

            //handle native payment
            if (currency === ethers.ZeroAddress) {
                tx = await signer.sendTransaction({
                    to: recipient,
                    value: data.orders[0].amount,
                });
            }

            //handle token payment 
            else {
                const token = getTokenContract(signer, currency);
                if (token) {
                    tx = await token.transfer(recipient, paymentGroups[currency]);
                }
            }

            //wait for tx to be confirmed 
            if (tx) {
                transaction_id = tx.hash;
                await tx.wait();
            }
        }

        const payer_address = await signer.getAddress();

        return {
            escrow_contract_address: '0x0',
            transaction_id,
            payer_address,
            success:
                transaction_id && transaction_id.length ? true : false,
        }
    }

    private createPaymentGroups(
        data: any,
        chainId: number
    ): { [key: string]: BigNumberish } {
        const output: { [key: string]: BigNumberish } = {};

        if (data.orders) {
            data.orders.forEach((o: any) => {
                let currency = getCurrencyAddress(o.currency_code, chainId);
                if (!currency?.length) currency = ethers.ZeroAddress;

                let amount = o.amount;

                if (output[currency])
                    amount += output[currency];

                output[currency] = amount;
            });

            return output;
        }
        return {};
    }
}