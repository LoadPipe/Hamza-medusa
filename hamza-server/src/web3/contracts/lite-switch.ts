import { BigNumberish, ethers } from 'ethers';
import { liteSwitchAbi } from '../abi/lite-switch-abi';
import { createPublicClient, http, PublicClient } from 'viem';
import { sepolia } from 'viem/chains';
import { getContractAddress } from '../../contracts.config';

export class LiteSwitchClient {
    contractAddress: `0x${string}`;
    client: any;
    tokens: { [id: string]: ethers.Contract } = {};

    /**
     * Constructor.
     * @param address Address of the LiteSwitch contract
     */
    constructor(
        chainId: number
    ) {
        this.contractAddress = getContractAddress('lite_switch', chainId);
        console.log(this.contractAddress);

        this.client = createPublicClient({
            chain: sepolia, //TODO: get from chain id
            transport: http(),
        });
    }

    async findPaymentEvents(orderId: string): Promise<any[]> {
        return await this.findEvents('PaymentReceived', { orderId });
    }

    async findEvents(eventName: string, args: any = null): Promise<any[]> {
        const events = await this.client.getContractEvents({
            address: this.contractAddress,
            abi: liteSwitchAbi,
            fromBlock: '0x6529B4', //TODO: get actual block starting block (contract creation block)
            eventName: eventName,
            args,
        });

        return events;
    }
}
