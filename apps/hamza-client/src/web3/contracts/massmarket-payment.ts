import { BigNumberish, ethers } from 'ethers';
import { massMarketPaymentAbi } from '../abi/massmarket-payment-abi';
import { erc20abi } from '../abi/erc20-abi';
import { IMultiPaymentInput, ITransactionOutput } from '..';
import { getCurrencyAddress } from '../../currency.config';
import { HexString } from 'ethers/lib.commonjs/utils/data';


interface IPaymentRequest {
    chainId: number;
    ttl: number; //block timestamp from cartFinalized event
    order: any; //keccak of cartId
    currency: HexString; //0x0 for native, otherwise the token address
    amount: BigNumberish; //payment amt (token or native)
    payeeAddress: HexString; //escrow contract
    isPaymentEndpoint: boolean; //true
    shopId: BigNumberish; //the storeId
    shopSignature: any; // 64 zeros
}

export class MassmarketPaymentClient {
    contractAddress: HexString;
    escrowAddress: HexString;
    paymentContract: ethers.Contract;
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
        address: HexString,
        escrowAddress: HexString
    ) {
        this.provider = provider;
        this.signer = signer;
        this.contractAddress = address;
        this.escrowAddress = escrowAddress;

        this.paymentContract = new ethers.Contract(
            this.contractAddress,
            massMarketPaymentAbi,
            signer
        );
    }

    async getPaymentId(request: IPaymentRequest) {
        return await this.paymentContract.getPaymentId(request);
    }

    async pay(inputs: IMultiPaymentInput[]) {
        const chainId = parseInt(
            (await this.provider.getNetwork()).chainId.toString()
        );

        //for wrong chain, just doing a very very fake checkout for now !
        const FAKE_IT = true;
        // if (chainId != 11155111 || process.env.NEXT_PUBLIC_FAKE_CHECKOUT) {
        if (!FAKE_IT) {
            // console.log('doing fake checkout');
            return {
                transaction_id: '0x00001',
                tx: { id: '0x00001', hash: '0x00001' },
                receipt: { from: '0x01', to: '0x02' },
            };
        }

        //prepare the inputs
        for (let n = 0; n < inputs.length; n++) {
            const input: IMultiPaymentInput = inputs[n];
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

        //const sleep = async (sec: number) => {
        //    return new Promise((resolve) => setTimeout(resolve, sec * 1000));
        //};

        //make any necessary token approvals
        await this.approveAllTokens(this.contractAddress, inputs);
        //await sleep(15);

        //get total native amount
        const nativeTotal: BigNumberish = this.getNativeTotal(inputs);
        // console.log('native amount:', nativeTotal);

        //default values, used for fake checkout
        let from = await this.signer.getAddress();
        let to: HexString = '0x8bA35513C3F5ac659907D222e3DaB38b20f8F52A';
        let receipt: any = { from, to };
        let txHash: any = '0x0';

        if (!process.env.NEXT_PUBLIC_FAKE_CHECKOUT || chainId != 11155111) {
            //get input appropriate for sending to Payment contract
            const requests: IPaymentRequest[] = this.convertInputs(inputs);

            // console.log('sending requests: ', requests, nativeTotal);

            if (requests.length) {
                // console.log(
                //     'paymentId',
                //     BigInt(await this.getPaymentId(requests[0])).toString(16)
                // );
                const permits: string[] = [];
                for (let i = 0; i < requests.length; i++) {
                    permits.push('0x');
                }
                const tx: any = await this.paymentContract.multiPay(
                    requests,
                    permits,
                    {
                        value: nativeTotal,
                    }
                );
                receipt = await tx.wait();
                txHash = tx.hash;
            }
        } else {
            txHash = await window.ethereum?.request({
                method: 'eth_sendTransaction',
                params: [
                    {
                        to: to as `0x${string}`,
                        from: from as `0x${string}`,
                        value: '0x100000',
                    },
                ],
            });
        }

        return {
            transaction_id: txHash,
            tx: { id: txHash, hash: txHash },
            receipt,
        };
    }

    private convertInputs(inputs: IMultiPaymentInput[]): IPaymentRequest[] {
        const output: IPaymentRequest[] = [];

        for (const input of inputs) {
            for (const payment of input.payments) {
                if (payment.massmarketOrderId?.length > 3) {
                    const request: IPaymentRequest = {
                        chainId: payment.chainId,
                        ttl: payment.massmarketTtl,
                        currency: input.currency,
                        amount: payment.massmarketAmount,
                        order: payment.massmarketOrderId,
                        payeeAddress:
                            '0x74b7284836f753101bd683c3843e95813b381f18', //TODO: get dynamic
                        isPaymentEndpoint: true, //TODO: get from mm output
                        shopId: payment.storeId,
                        shopSignature: new Uint8Array(64),
                    };
                    output.push(request);
                }
            }
        }

        return output;
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

        //this will sum the amounts to pay for each token
        const sum = (arr: { massmarketAmount: BigNumberish }[]) =>
            arr.reduce(
                (acc, obj) => BigInt(acc) + BigInt(obj.massmarketAmount ?? 0),
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

    private getNativeTotal(inputs: IMultiPaymentInput[]): BigNumberish {
        //TODO: this is too similar to getTokensAndAmounts
        let output: bigint = BigInt(0);
        const sum = (arr: { massmarketAmount: BigNumberish }[]) =>
            arr.reduce(
                (acc, obj) => BigInt(acc) + BigInt(obj.massmarketAmount ?? 0),
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
    private getTokenContract(address: string): ethers.Contract {
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
        const allowance = BigInt(await token.allowance(tokenAddr, spender));

        // Convert amount to bigint for comparison and arithmetic, assuming it could be string, number, or bigint already
        // BigNumber instances (from ethers.js or similar libraries) should be converted to string or number before passing to this function
        let bigintAmount = BigInt(amount);
        // console.log(`allowance of ${tokenAddr} for ${spender} is ${allowance}`);

        if (allowance > 0) {
            amount =
                allowance < bigintAmount ? bigintAmount - allowance : BigInt(0);
        }

        // Approve if necessary
        if (bigintAmount > 0) {
            // console.log(
            //     `approving ${bigintAmount} of ${tokenAddr} for ${spender}`
            // );
            const tx = await token.approve(spender, bigintAmount.toString()); // Convert bigint back to string for the smart contract call
            await tx.wait();
            await this.provider.waitForTransaction(tx.hash, 1);
        }
    }
}
