import { BigNumberish, ethers } from 'ethers';
import { escrowAbi } from '../abi/escrow-abi';

export type PaymentDefinition = {
    id: string;
    payer: string;
    receiver: string;
    amount: BigNumberish;
    amountRefunded: BigNumberish;
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

export class EscrowClient {
    contractAddress: string;
    contract: ethers.Contract;
    provider: ethers.Provider;
    signer: ethers.Signer;
    tokens: { [id: string]: ethers.Contract } = {};

    /**
     * Constructor.
     * @param address Address of the LiteSwitch contract
     */
    constructor(chainId: number, address: string) {
        this.provider = new ethers.JsonRpcProvider(
            process.env[`ETHERS_RPC_PROVIDER_URL_${chainId}`]
        );
        this.contractAddress = address;

        this.contract = new ethers.Contract(
            this.contractAddress,
            escrowAbi,
            this.provider
        );
    }

    async getEscrowPayment(paymentId: string): Promise<PaymentDefinition> {
        const output = await this.contract.getPayment(
            ethers.keccak256(ethers.toUtf8Bytes(paymentId))
        );

        return {
            id: output[0],
            payer: output[1],
            receiver: output[2],
            amount: output[3].toString(),
            amountRefunded: output[4].toString(),
            payerReleased: output[5],
            receiverReleased: output[6],
            released: output[7],
            currency: output[8],
        };
    }
}
