'use client';

import { ethers, BigNumberish, TransactionResponse } from 'ethers';
import { getCurrencyPrecision } from '@/currency.config';
import { EscrowMulticallClient } from '@/web3/contracts/escrow';
import {
    IWalletPaymentHandler,
    CheckoutData,
    WalletPaymentResponse,
    checkWalletBalance,
} from './common';
import { getContractAddress } from '@/contracts.config';

/**
 * Wallet payment handler for 'switch' checkout strategy, sends payment to the Hamza
 * 'escrow' escrow contract.
 */
export class EscrowWalletPaymentHandler implements IWalletPaymentHandler {
    async doWalletPayment(
        provider: ethers.Provider | null,
        signer: ethers.Signer,
        chainId: any,
        data: CheckoutData
    ): Promise<WalletPaymentResponse> {
        let transaction_id = '';
        let payer_address = '';
        console.log('CHECKOUT DATA IS', data);

        if (provider) {
            const client: EscrowMulticallClient = new EscrowMulticallClient(
                provider,
                signer,
                getContractAddress('escrow_multicall', chainId)
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
                        receiver_address: '0x0',
                        success: false,
                        chain_id: chainId,
                        message: `Wallet has an insufficient balance in ${currency.toUpperCase()} to pay for this transaction`,
                    };
                }
            }

            const tx = await client.multipay(inputs);
            transaction_id = tx.transaction_id;
        }

        return {
            escrow_address: '0x0', //TODOX: doesn't make sense anymore
            payer_address,
            receiver_address: '0x0', //TODOX: doesn't make sense anymore
            transaction_id,
            chain_id: chainId,
            success: transaction_id && transaction_id.length ? true : false,
        };
    }

    private createPaymentInput(data: any, payer: string, chainId: any) {
        if (data.orders) {
            const paymentInput: any[] = [];
            data.orders.forEach((o: any) => {
                const input = {
                    currency: o.currency_code,
                    id: ethers.keccak256(ethers.toUtf8Bytes(o.order_id)),
                    payer,
                    receiver: o.wallet_address,
                    contractAddress: o.escrow_metadata.address,
                    amount: process.env.NEXT_PUBLIC_ONE_SATOSHI_DISCOUNT
                        ? 1
                        : this.convertToNativeAmount(
                              o.currency_code,
                              o.amount,
                              chainId
                          ),
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

    //TODOX: these are all 'any' now
    private groupPaymentsByCurrency(
        inputs: any[]
    ): { currency: string; amount: BigInt }[] {
        const output: { currency: string; amount: BigInt }[] = [];
        for (let input of inputs) {
            let existing = output.find((o) => o.currency == input.currency);
            if (!existing) {
                existing = { currency: input.currency, amount: BigInt(0) };
                output.push(existing);
            } else {
                let amt: any = existing.amount;
                amt += BigInt(input.amount);
                existing.amount = amt;
            }
        }

        return output;
    }
}
