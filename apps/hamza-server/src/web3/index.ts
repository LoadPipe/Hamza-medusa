import { BigNumberish } from 'ethers';
import { LiteSwitchClient } from './contracts/lite-switch';


export async function verifyPaymentForOrder(
    chainId: number,
    transactionId: string,
    orderId: string,
    amount: BigNumberish
): Promise<boolean> {
    const total: bigint = await getAmountPaidForOrder(chainId, transactionId, orderId, amount);
    return (total >= BigInt(amount));
}

export async function getAmountPaidForOrder(
    chainId: number,
    transactionId: string,
    orderId: string,
    amount: BigNumberish
): Promise<bigint> {
    const switchClient = new LiteSwitchClient(chainId);
    const events = await switchClient.findPaymentEvents(orderId, transactionId);
    //console.log('events: ', events);

    let total: bigint = BigInt(0);
    if (events.length) {
        events.map(e => total = total + BigInt(e.amount.toString()));
    }

    return (BigInt(total));
}