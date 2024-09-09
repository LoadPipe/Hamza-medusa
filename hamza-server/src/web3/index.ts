import { BigNumberish, ethers } from 'ethers';
import { LiteSwitchClient } from './contracts/lite-switch';


export async function verifyPaymentForOrder(chainId: number, orderId: string, amount: BigNumberish): Promise<boolean> {
    const switchClient = new LiteSwitchClient(chainId);
    const events = await switchClient.findPaymentEvents(orderId);
    console.log('events: ', events);

    let total: BigNumberish = 0;
    if (events.length) {
        events.map(e => total += e.amount);
    }

    console.log('total vs. amount: ', total, amount);
    return (BigInt(total) >= BigInt(amount));
}