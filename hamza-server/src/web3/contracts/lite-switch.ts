import { BigNumberish, ethers } from 'ethers';
import { liteSwitchAbi } from '../abi/lite-switch-abi';
import { getContractAddress } from '../../contracts.config';


export class LiteSwitchClient {
    contractAddress: `0x${string}`;
    switchClient: ethers.Contract;
    provider: ethers.Provider;
    signer: ethers.Signer;
    tokens: { [id: string]: ethers.Contract } = {};

    /**
     * Constructor.
     * @param address Address of the LiteSwitch contract
     */
    constructor(
        chainId: number
    ) {
        this.contractAddress = getContractAddress('lite_switch', chainId);
        this.provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/demo'); //TODO don't hard-code

        this.switchClient = new ethers.Contract(
            this.contractAddress,
            liteSwitchAbi,
            this.provider
        );
    }

    async findPaymentEvents(orderId): Promise<{ orderId: string, amount: BigNumberish }[]> {
        const orderIdHash = ethers.keccak256(ethers.toUtf8Bytes(orderId));
        const eventFilter = this.switchClient.filters.PaymentReceived();

        const startingBlock = 0x6529B4;//TODO don't hard-code

        const events = await this.switchClient.queryFilter(eventFilter, startingBlock, "latest");

        console.log(events[events.length - 1]);

        return events.map(e => {
            const event = e as any;
            return {
                orderId: event.args[0].hash,
                amount: event.args[4]
            }
        }).filter(e => e.orderId === orderIdHash);
    }
}
