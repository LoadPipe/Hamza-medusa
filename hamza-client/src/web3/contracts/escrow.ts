import { BigNumberish, ethers } from 'ethers';
import { ITransactionOutput } from '..';
import { getCurrencyAddress } from '../../currency.config';
import { escrowMulticallAbi } from '../abi/escrow-multicall-abi';
import { erc20abi } from '../abi/erc20-abi';
import { escrowAbi } from '../abi/escrow-abi';

export type PaymentDefinition = {
    id: string;
    payer: string;
    receiver: string;
    amount: number;
    amountRefunded: number;
    payerReleased: boolean;
    receiverReleased: boolean;
    released: boolean;
    currency: string; //token address, or 0x0 for native
};

export type EscrowPaymentDefinition = {
    order_id: string;
    escrow_address: string;
    chain_id: number;
    payment: PaymentDefinition;
};

export type MulticallPaymentInput = {
    id: string;
    contractAddress: string;
    currency: string;
    receiver: string;
    payer: string;
    amount: BigNumberish;
};

export class EscrowMulticallClient {
    contractAddress: string;
    contract: ethers.Contract;
    provider: ethers.Provider;
    signer: ethers.Signer;
    tokens: { [id: string]: ethers.Contract } = {};

    constructor(
        provider: ethers.Provider,
        signer: ethers.Signer,
        address: string
    ) {
        this.provider = provider;
        this.signer = signer;
        this.contractAddress = address;

        this.contract = new ethers.Contract(
            this.contractAddress,
            escrowMulticallAbi,
            signer
        );
    }

    async multipay(inputs: any[]): Promise<ITransactionOutput> {
        //prepare the inputs
        for (let n = 0; n < inputs.length; n++) {
            const input: any = inputs[n];
            if (!input.currency || input.currency === 'eth') {
                input.currency = ethers.ZeroAddress;
            } else {
                if (!ethers.isAddress(input.currency)) {
                    input.currency = getCurrencyAddress(
                        input.currency,
                        parseInt(
                            (
                                await this.provider.getNetwork()
                            ).chainId.toString()
                        )
                    );
                }
            }
        }

        //make any necessary token approvals
        await this.approveAllTokens(this.contractAddress, inputs);

        //get total native amount
        const nativeTotal: BigNumberish = this.getNativeTotal(inputs);
        console.log('native amount:', nativeTotal);
        console.log('inputs to contract: ', inputs);

        const tx: any = await this.contract.multipay(inputs, {
            value: nativeTotal,
        });

        const transaction_id = tx.hash;
        const receipt = await tx.wait();

        return {
            transaction_id,
            tx,
            receipt,
        };
    }

    /**
     * In a batch of payments to be made, total up the amounts per currency. Returns a
     * dictionary of distinct token addresses, with their respective total amounts.
     *
     * @param inputs An array of payment inputs
     * @returns A dictionary in which the keys are token addresses, the values are amounts.
     */
    protected getTokensAndAmounts(
        inputs: { currency: string; amount: BigNumberish }[]
    ): {
        [id: string]: BigNumberish;
    } {
        const output: { [id: string]: BigNumberish } = {};

        //get the sum for each token
        inputs.forEach((i) => {
            //place a 0 if entry is null, otherwise place a sum of all payments
            if (i.currency != ethers.ZeroAddress) {
                output[i.currency] = output[i.currency]
                    ? BigInt(output[i.currency]) + BigInt(i.amount)
                    : BigInt(i.amount);
            }
        });

        return output;
    }

    protected getNativeTotal(
        inputs: { currency: string; amount: BigNumberish }[]
    ): BigNumberish {
        //TODO: this is too similar to getTokensAndAmounts
        let output: bigint = BigInt(0);
        inputs.forEach((i) => {
            //place a 0 if entry is null, otherwise place a sum of all payments
            if (i.currency == ethers.ZeroAddress) {
                output += BigInt(i.amount);
            }
        });

        return output;
    }

    /**
     * Gets the token contract corresponding to the given address, and stores it
     * for later.
     *
     * @param address An ERC20 token address
     * @returns An ethers.Contract object
     */
    protected getTokenContract(address: string): ethers.Contract {
        let output: ethers.Contract = this.tokens[address];

        //if not yet created, create & store it
        if (!output) {
            output = new ethers.Contract(address, erc20abi, this.signer);
            this.tokens[address] = output;
        }

        return output;
    }

    /**
     * Given an array of payment inputs, makes any token approvals that are necessary
     * in order for the payments to be completed.
     *
     * @param spender The contract address which will receive approval
     * @param inputs An array of payment inputs
     */
    protected async approveAllTokens(
        spender: string,
        inputs: any[]
    ): Promise<void> {
        const tokenAmounts = this.getTokensAndAmounts(inputs);

        //approve each token amount
        const promises: Promise<void>[] = [];
        for (let tokenAddr in tokenAmounts) {
            promises.push(
                this.approveToken(spender, tokenAddr, tokenAmounts[tokenAddr])
            );
        }
        await Promise.all(promises);
    }

    /**
     * Approves an amount of a token to be spent, if the existing allowance is insufficient.
     *
     * @param spender The contract address which will receive approval
     * @param tokenAddr The token address
     * @param amount The amount that needs to be approved
     */
    protected async approveToken(
        spender: string,
        tokenAddr: string,
        amount: BigNumberish
    ): Promise<void> {
        const token = this.getTokenContract(tokenAddr);

        //check first for existing allowance before approving
        const allowance = BigInt(await token.allowance(tokenAddr, spender));

        // Convert amount to bigint for comparison and arithmetic, assuming it could be string, number, or bigint already
        // BigNumber instances (from ethers.js or similar libraries) should be converted to string or number before passing to this function
        const bigintAmount = BigInt(amount);

        if (allowance > 0) {
            amount =
                allowance < bigintAmount ? bigintAmount - allowance : BigInt(0);
        }

        // Approve if necessary
        if (bigintAmount > 0) {
            const tx = await token.approve(spender, bigintAmount.toString()); // Convert bigint back to string for the smart contract call
            await tx.wait();
        }
    }
}

export class EscrowClient {
    contractAddress: string;
    contract: ethers.Contract;
    provider: ethers.BrowserProvider;
    signer: ethers.Signer;
    tokens: { [id: string]: ethers.Contract } = {};

    /**
     * Constructor.
     * @param address Address of the LiteSwitch contract
     */
    constructor(
        provider: ethers.BrowserProvider,
        signer: ethers.Signer,
        address: string
    ) {
        this.provider = provider;
        this.signer = signer;
        this.contractAddress = address;

        this.contract = new ethers.Contract(
            this.contractAddress,
            escrowAbi,
            signer
        );
    }

    /**
     * Fully or partially refund a payment.
     *
     * @param paymentId Uniquely identifies the payment to be refunded.
     * @param amount The amount to refund.
     * @returns
     */
    async refundPayment(
        paymentId: string,
        amount: BigNumberish
    ): Promise<ITransactionOutput> {
        try {
            const tx: any = await this.contract.refundPayment(
                paymentId,
                amount
            );
            const transaction_id = tx.hash;
            const receipt = await tx.wait();

            return {
                transaction_id,
                tx,
                receipt,
            };
        } catch (error) {
            throw error;
        }
    }

    async getPayment(paymentId: string): Promise<PaymentDefinition> {
        const output = await this.contract.getPayment(paymentId);

        return {
            id: output[0],
            payer: output[1],
            receiver: output[2],
            amount: output[3],
            amountRefunded: output[4],
            payerReleased: output[5],
            receiverReleased: output[6],
            released: output[7],
            currency: output[8],
        };
    }

    /**
     * Set a flag that the seller considers that the escrow should be released.
     *
     * @param paymentId Uniquely identifies the payment to be released.
     * @returns
     */
    async releaseEscrow(paymentId: string): Promise<ITransactionOutput> {
        try {
            const tx: any = await this.contract.releaseEscrow(paymentId);
            const transaction_id = tx.hash;
            const receipt = await tx.wait();

            return {
                transaction_id,
                tx,
                receipt,
            };
        } catch (error) {
            throw error;
        }
    }
}
