import { BigNumberish, ethers } from 'ethers';
import { switchAbi } from '../abi/switch-abi';
import { IPaymentInput, IMultiPaymentInput, ITransactionOutput } from '..';
import { getCurrencyAddress } from '../../currency.config';

//DEPRECATED 

/**
 * Client-side Switch contract client; allows for payments to be made.
 */
export class SwitchClient {
    contractAddress: string;
    paymentSwitch: ethers.Contract;
    provider: ethers.Provider;
    signer: ethers.Signer;
    tokens: { [id: string]: ethers.Contract } = {};

    /**
     * Constructor.
     * @param address Address of the PaymentSwitch contract
     */
    constructor(
        provider: ethers.Provider,
        signer: ethers.Signer,
        address: string
    ) {
        this.provider = provider;
        this.signer = signer;
        this.contractAddress = address;
        this.paymentSwitch = new ethers.Contract(
            this.contractAddress,
            switchAbi,
            signer
        );
    }

    /**
     * Place a single payment in a single currency.
     * @param input The payment input
     */
    async placeSinglePayment(
        input: IPaymentInput
    ): Promise<ITransactionOutput> {
        //check for token currency
        if (input.currency) {
            //if it's already a proper address, we can use it; otherwise, convert
            //currency name to currency address
            if (!ethers.isAddress(input.currency)) {
                input.currency = getCurrencyAddress(
                    input.currency,
                    parseInt(
                        (await this.provider.getNetwork()).chainId.toString()
                    )
                );
                console.log('input currency type is ', input.currency);
            }
        }

        const tx: any = await this.paymentSwitch.placePayment(input, {
            value: input.amount,
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
     * Place multiple payments in single or multiple different currencies.
     * @param inputs An array of payment inputs
     */
    async placeMultiplePayments(inputs: IMultiPaymentInput[]) {
        //make any necessary token approvals
        await this.approveAllTokens(this.contractAddress, inputs);

        //place payments
        await this.paymentSwitch.placeMultiplePayments(inputs);
    }

    /**
     * In a batch of payments to be made, total up the amounts per currency. Returns a
     * dictionary of distinct token addresses, with their respective total amounts.
     *
     * @param inputs An array of payment inputs
     * @returns A dictionary in which the keys are token addresses, the values are amounts.
     */
    private getTokensAndAmounts(inputs: IMultiPaymentInput[]): {
        [id: string]: BigNumberish;
    } {
        const output: { [id: string]: BigNumberish } = {};
        const sum = (arr: { amount: BigNumberish }[]) =>
            arr.reduce(
                (acc, obj) => BigInt(acc) + BigInt(obj.amount),
                BigInt(0)
            );

        inputs.forEach((i) => {
            //place a 0 if entry is null, otherwise place a sum of all payments
            if (i.currency != ethers.ZeroAddress) {
                output[i.currency] = output[i.currency]
                    ? BigInt(output[i.receiver]) + sum(i.payments)
                    : 0;
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
    private getTokenContract(address: string): ethers.Contract {
        let output: ethers.Contract = this.tokens[address];

        //if not yet created, create & store it
        if (!output) {
            output = new ethers.Contract(address, [], null);
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
    private async approveAllTokens(
        spender: string,
        inputs: IMultiPaymentInput[]
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
    private async approveToken(
        spender: string,
        tokenAddr: string,
        amount: BigNumberish
    ): Promise<void> {
        const token = this.getTokenContract(tokenAddr);

        //check first for existing allowance before approving
        const allowance = BigInt(
            await token.allowance(/*owner*/ ethers.ZeroAddress, spender)
        );

        // Convert amount to bigint for comparison and arithmetic, assuming it could be string, number, or bigint already
        // BigNumber instances (from ethers.js or similar libraries) should be converted to string or number before passing to this function
        const bigintAmount = BigInt(amount);

        if (allowance > 0) {
            amount =
                allowance < bigintAmount ? bigintAmount - allowance : BigInt(0);
        }

        // Approve if necessary
        if (bigintAmount > 0) {
            await token.approve(spender, bigintAmount.toString()); // Convert bigint back to string for the smart contract call
        }
    }
}
