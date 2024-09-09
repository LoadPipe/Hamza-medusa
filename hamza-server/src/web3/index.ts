import { BigNumberish } from 'ethers';
import { LiteSwitchClient } from './contracts/lite-switch';


export async function verifyPaymentForOrder(chainId: number, orderId: string, amount: BigNumberish): Promise<boolean> {
    const switchClient = new LiteSwitchClient(chainId);
    const events = await switchClient.findPaymentEvents(orderId);
    console.log('events: ', events);

    let total: bigint = BigInt(0);
    if (events.length) {
        events.map(e => total = total + BigInt(e.args.amount.toString()));
    }

    console.log('total vs. amount: ', total, amount); //TODO: amount must be adjusted for currency
    return (BigInt(total) >= BigInt(amount));
}