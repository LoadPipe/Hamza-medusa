import { BigNumberish } from 'ethers';
import { LiteSwitchClient } from './contracts/lite-switch';


export async function verifyPaymentForOrder(chainId: number, orderId: string, amount: BigNumberish): Promise<boolean> {
    const total: bigint = await getAmountPaidForOrder(chainId, orderId, amount);
    return (total >= BigInt(amount));
}

export async function getAmountPaidForOrder(chainId: number, orderId: string, amount: BigNumberish): Promise<bigint> {
    const switchClient = new LiteSwitchClient(chainId);
    const events = await switchClient.findPaymentEvents(orderId);
    console.log('events: ', events);

    let total: bigint = BigInt(0);
    if (events.length) {
        events.map(e => total = total + BigInt(e.amount.toString()));
    }

    return (BigInt(total));
}