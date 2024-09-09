import { BigNumberish, ethers } from 'ethers';
import { liteSwitchAbi } from '../abi/lite-switch-abi';
import { erc20abi } from '../abi/erc20-abi';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

export class LiteSwitchClient {
    contractAddress: string;
    switchClient: ethers.Contract;
    provider: ethers.Provider;
    signer: ethers.Signer;
    tokens: { [id: string]: ethers.Contract } = {};

    /**
     * Constructor.
     * @param address Address of the LiteSwitch contract
     */
    constructor(
        provider: ethers.Provider,
        signer: ethers.Signer,
        address: string
    ) {
        this.provider = provider;
        this.signer = signer;
        this.contractAddress = address;

        this.switchClient = new ethers.Contract(
            this.contractAddress,
            liteSwitchAbi,
            signer
        );
    }

    async findPaymentEvents(orderId: string): Promise<any[]> {
        return await this.findEvents('PaymentReceived', { orderId });
    }

    async findEvents(eventName: string, args: any = null): Promise<any[]> {

        // Create a client to interact with Ethereum
        const client = createPublicClient({
            chain: sepolia,
            transport: http(),
        });
        // Get the logs from the blockchain
        const events = await client.getContractEvents({
            address: '0x1fFc6ba4FcdfC3Ca72a53c2b64db3807B4A5aec8',
            abi: liteSwitchAbi,
            eventName: eventName,
            args,
        });

        return events;
    }
}
