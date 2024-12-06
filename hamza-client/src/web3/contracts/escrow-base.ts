import { BigNumberish, ethers } from 'ethers';
import { liteSwitchAbi } from '../abi/lite-switch-abi';
import { erc20abi } from '../abi/erc20-abi';
import { ISwitchMultiPaymentInput, ITransactionOutput } from '..';
import { getCurrencyAddress } from '../../currency.config';

export abstract class EscrowBase {
    contractAddress: string;
    contract: ethers.Contract;
    provider: ethers.Provider;
    signer: ethers.Signer;
    tokens: { [id: string]: ethers.Contract } = {};
    abi: any;

    /**
     * Constructor.
     * @param address Address of the LiteSwitch contract
     */
    constructor(
        provider: ethers.Provider,
        signer: ethers.Signer,
        address: string,
        abi: any
    ) {
        this.provider = provider;
        this.signer = signer;
        this.contractAddress = address;
        this.abi = abi;

        this.contract = new ethers.Contract(
            this.contractAddress,
            this.abi,
            signer
        );
    }

    /**
     * In a batch of payments to be made, total up the amounts per currency. Returns a
     * dictionary of distinct token addresses, with their respective total amounts.
     *
     * @param inputs An array of payment inputs
     * @returns A dictionary in which the keys are token addresses, the values are amounts.
     */
    protected getTokensAndAmounts(
        inputs: { currency: string; payments: { amount: BigNumberish }[] }[]
    ): {
        [id: string]: BigNumberish;
    } {
        const output: { [id: string]: BigNumberish } = {};

        //this will sum the amounts to pay for each token
        const sum = (arr: { amount: BigNumberish }[]) =>
            arr.reduce(
                (acc, obj) => BigInt(acc) + BigInt(obj.amount),
                BigInt(0)
            );

        //get the sum for each token
        inputs.forEach((i) => {
            //place a 0 if entry is null, otherwise place a sum of all payments
            if (i.currency != ethers.ZeroAddress) {
                output[i.currency] = output[i.currency]
                    ? BigInt(output[i.currency]) + sum(i.payments)
                    : sum(i.payments);
            }
        });

        return output;
    }

    protected getNativeTotal(
        inputs: { currency: string; payments: { amount: BigNumberish }[] }[]
    ): BigNumberish {
        //TODO: this is too similar to getTokensAndAmounts
        let output: bigint = BigInt(0);
        const sum = (arr: { amount: BigNumberish }[]) =>
            arr.reduce(
                (acc, obj) => BigInt(acc) + BigInt(obj.amount),
                BigInt(0)
            );

        inputs.forEach((i) => {
            //place a 0 if entry is null, otherwise place a sum of all payments
            if (i.currency == ethers.ZeroAddress) {
                output += sum(i.payments);
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
        inputs: ISwitchMultiPaymentInput[]
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
