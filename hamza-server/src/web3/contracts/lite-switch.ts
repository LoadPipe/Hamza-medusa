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
        this.provider = new ethers.JsonRpcProvider(process.env.ETHERS_RPC_PROVIDER_URL);

        this.switchClient = new ethers.Contract(
            this.contractAddress,
            liteSwitchAbi,
            this.provider
        );
    }

    async findPaymentEvents(orderId: string, transactionId: string):
        Promise<{ orderId: string, amount: BigNumberish }[]> {

        const orderIdHash = ethers.keccak256(ethers.toUtf8Bytes(orderId));
        const eventFilter = this.switchClient.filters.PaymentReceived();

        const txReceipt = await this.provider.getTransactionReceipt(transactionId);

        const events = await this.switchClient.queryFilter(
            eventFilter,
            txReceipt.blockNumber,
            txReceipt.blockNumber + 1
        );

        return events.map(e => {
            const event = e as any;
            return {
                orderId: event.args[0].hash,
                amount: event.args[4]
            }
        }).filter(e => e.orderId === orderIdHash);
    }
}
