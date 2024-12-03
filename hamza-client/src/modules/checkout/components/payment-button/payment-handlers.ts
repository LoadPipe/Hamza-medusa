'use client';

import { ITransactionOutput, IMultiPaymentInput } from '@/web3';
import { MassmarketPaymentClient } from '@/web3/contracts/massmarket-payment';
import { ethers, BigNumberish, TransactionResponse } from 'ethers';
import { getCurrencyPrecision } from '@/currency.config';
import {
    getMassmarketPaymentAddress,
    getMasterSwitchAddress,
} from '@/contracts.config';
import { getCurrencyAddress } from '@/currency.config';
import { getContractAddress } from '@/contracts.config';
import { erc20abi } from '../../../../web3/abi/erc20-abi';
import { LiteSwitchClient } from '@/web3/contracts/lite-switch';
import { ISwitchMultiPaymentInput } from '@/web3';
import { block } from 'sharp';

export type WalletPaymentResponse = {
    transaction_id: string;
    payer_address: string;
    receiver_address: string;
    escrow_address: string;
    message?: string;
    chain_id: number;
    success: boolean;
};

// checkout data retrieved from server, to help in creating blockchain payments
export type CheckoutData = {
    order_id: string; //medusa order id
    cart_id: string; //medusa cart id
    receiver_address: string; //wallet address of store owner
    escrow_contract_address: string;
    currency_code: string; //currency code
    amount: string; //medusa amount
    massmarket_amount: string; //massmarket amount
    massmarket_order_id: string; //keccak256 of cartId (massmarket)
    massmarket_ttl: number;
    orders: any[]; //medusa orders
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
function getTokenContract(
    signer: ethers.Signer,
    address: string
): ethers.Contract {
    return new ethers.Contract(address, erc20abi, signer);
}

async function checkWalletBalance(
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
        let receiver_address = data.receiver_address;

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
        let receiver_address = data.receiver_address;

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
        let receiver_address = data.receiver_address;

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
                        escrow_address: '0x0',
                        transaction_id,
                        payer_address,
                        receiver_address,
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
            escrow_address: contractAddress,
            payer_address,
            receiver_address,
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

/**
 * Wallet payment handler for 'switch' checkout strategy, sends payment to the Hamza
 * 'switch' escrow contract.
 */
export class EscrowWalletPaymentHandler implements IWalletPaymentHandler {
    async doWalletPayment(
        provider: ethers.Provider | null,
        signer: ethers.Signer | null,
        chainId: any,
        data: CheckoutData
    ): Promise<WalletPaymentResponse> {
        return {
            escrow_address: data.escrow_contract_address,
            payer_address: '',
            receiver_address: data.receiver_address,
            transaction_id: '',
            success: false,
            chain_id: chainId,
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
        let receiver_address = data.receiver_address;

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
                        escrow_address: '0x0',
                        transaction_id,
                        payer_address,
                        receiver_address,
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
            escrow_address: '0x0',
            transaction_id,
            payer_address,
            receiver_address,
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
