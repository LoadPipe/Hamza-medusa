import { BigNumberish, ethers } from 'ethers';
import { LiteSwitchClient } from './contracts/lite-switch';
import { EscrowClient, PaymentDefinition } from './contracts/escrow';

export async function verifyPaymentForOrder(
    chainId: number,
    transactionId: string,
    orderId: string,
    amount: BigNumberish
): Promise<boolean> {
    const total: bigint = await getAmountPaidForOrder(
        chainId,
        transactionId,
        orderId,
        amount
    );
    return total >= BigInt(amount);
}

export async function getAmountPaidForOrder(
    chainId: number,
    transactionId: string,
    orderId: string,
    amount: BigNumberish
): Promise<bigint> {
    const switchClient = new LiteSwitchClient(chainId);
    const events = await switchClient.findPaymentEvents(orderId, transactionId);

    let total: bigint = BigInt(0);
    if (events.length) {
        events.map((e) => (total = total + BigInt(e.amount.toString())));
    }

    return BigInt(total);
}

export async function getEscrowPayment(
    chainId: number,
    escrowAddress: string,
    orderId: string
): Promise<PaymentDefinition> {
    try {
        const escrow = new EscrowClient(chainId, escrowAddress);
        const payment = await escrow.getEscrowPayment(orderId);

        return paymentIsValid(payment) ? payment : null;
    } catch (e: any) {
        console.error('Error getting the payment:', e); // Log the error}
    }
}

function paymentIsValid(payment: PaymentDefinition | null): boolean {
    if (payment?.id) {
        //return true if id contains more than just x and 0
        const id: string = payment.id.toString() ?? '';
        return (
            id !=
            '0x0000000000000000000000000000000000000000000000000000000000000000'
        );
    }

    return false;
}

/**
 * Searches the order data for an escrow contract address.
 *
 * @param order Any Order object with payments.
 * @returns Address of escrow contract.
 */
export function findEscrowDataFromOrder(order: any): {
    address: string;
    chain_id: number;
} {
    order?.payments?.sort((a: any, b: any) => a.created_at < b.created_at);
    return {
        address: order?.payments[0]?.blockchain_data?.escrow_address,
        chain_id: order?.payments[0]?.blockchain_data?.chain_id ?? 0,
    };
}
