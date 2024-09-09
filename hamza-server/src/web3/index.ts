import { BigNumberish, ethers } from 'ethers';
import { HexString } from 'ethers/lib.commonjs/utils/data';
import { createPublicClient, http } from 'viem';
import { mainnet, optimism, sepolia } from 'viem/chains';
import { liteSwitchAbi } from './abi/lite-switch-abi';
import { getContractAddress } from 'src/contracts.config';


export async function verifyPaymentForOrder(orderId: string, amount: BigNumberish): Promise<boolean> {
    const switchClient = new LiteSwitchClient();
    const events = await switchClient.findPaymentEvents(orderId);
    let total: BigNumberish = 0;
    if (events.length) {
        events.map(e => total += e.amount);
    }

    return (BigInt(total) >= BigInt(amount));
}