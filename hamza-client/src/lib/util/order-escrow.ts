import { ITransactionOutput } from '@/web3';
import {
    EscrowClient,
    Order,
    Payment,
    PaymentDefinition,
} from '@/web3/contracts/escrow';
import { BigNumberish, ethers } from 'ethers';
import { keccak256, toUtf8Bytes } from 'ethers';

/**
 * Releases a payment in escrow, from the seller side, on the escrow contract on the blockchain.
 *
 * @param order An Order object with payments attached
 *
 * Will return false if the order doesn't have the appropriate blockchain data (e.g. escrow address)
 * to make the call to the contract, or if a web3 provider isn't available.
 *
 * Throws if the blockchain operation fails in the contract (e.g. amount is invalid, invalid order id
 * from the escrow contract's point of view, etc.)
 *
 * @returns True if it was possible to make the contract call.
 */
export async function releaseEscrowPayment(
    order: Order,
    validateBy: 'seller' | 'buyer' | 'all' = 'all'
): Promise<ITransactionOutput> {
    if (window.ethereum) {
        const escrow: EscrowClient = await createEscrowContract(order);

        try {
            const payment = await getEscrowPayment(order);

            //validate before releasing
            validatePaymentExists(payment, order.id);
            if (validateBy === 'buyer' || validateBy === 'all') {
                validatePaymentNotReleased(payment, order.id);
            }
            if (validateBy === 'seller' || validateBy === 'all') {
                validatePaymentNotReleasedBySeller(payment, order.id);
            }

            const releaseData = await escrow.releaseEscrow(
                keccak256(toUtf8Bytes(order.id))
            );

            return releaseData;
        } catch (error) {
            console.error('Error during escrow release:', error); // Log the error
            throw error; // Ensure the error is propagated
        }
    } else {
        console.error('No web3 provider available.'); // Log the missing provider error
        throw new Error('No web3 provider available.');
    }
}

/**
 *
 * @param order An Order object with payments attached
 * @param amount The amount to refund, expressed in actual wei (or whatever unit is appropriate
 * for the given token, if payment was in token)
 *
 * Will return false if the order doesn't have the appropriate blockchain data (e.g. escrow address)
 * to make the call to the contract, or if a web3 provider isn't available.
 *
 * Throws if the blockchain operation fails in the contract (e.g. amount is invalid, invalid order id
 * from the escrow contract's point of view, etc.)
 *
 * @returns True if it was possible to make the contract call.
 */
export async function refundEscrowPayment(
    order: Order,
    amount: BigNumberish
): Promise<boolean | undefined> {
    if (window.ethereum) {
        try {
            const escrow: EscrowClient = await createEscrowContract(order);

            if (escrow) {
                const payment = await getEscrowPayment(order);
                console.log(payment);
                //validate before refunding
                validatePaymentExists(payment, order.id);
                validatePaymentNotReleased(payment, order.id);
                validateRefundAmount(payment, order.id, amount);

                await escrow.refundPayment(
                    keccak256(toUtf8Bytes(order.id)),
                    amount
                );
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw error; // Ensure the error propagates to the caller
        }
    } else {
        // console.error('No web3 provider available.');
        throw new Error('No web3 provider available');
    }
}

/**
 * Searches the order data for an escrow contract address.
 *
 * @param order Any Order object with payments.
 * @returns Address of escrow contract.
 */
export function findEscrowDataFromOrder(order: Order): {
    address: string;
    chain_id: number;
} {
    order?.payments?.sort((a: Payment, b: Payment) =>
        a.created_at < b.created_at ? -1 : 1
    );
    return {
        address: order?.payments[0]?.blockchain_data?.escrow_address,
        chain_id: order?.payments[0]?.blockchain_data?.chain_id ?? 0,
    };
}

/**
 * Searches the order data for an escrow contract address and instantiates a contract client.
 *
 * @param order Any Order object with payments.
 * @returns EscrowClient object.
 */
async function createEscrowContract(order: Order): Promise<EscrowClient> {
    if (!window.ethereum) {
        throw new Error('No web3 provider available');
    }
    const provider: ethers.BrowserProvider = new ethers.BrowserProvider(
        window.ethereum as ethers.Eip1193Provider
    );

    const signer: ethers.Signer = await provider.getSigner();

    const escrowData = findEscrowDataFromOrder(order);
    if (!escrowData) {
        throw new Error('No escrow address found in order');
    }

    const escrow: EscrowClient = new EscrowClient(
        provider,
        signer,
        escrowData.address
    );

    return escrow;
}

/**
 * Gets a payment definition for the given order, from the escrow if it exists.
 *
 * @returns PaymentDefinition
 */
export async function getEscrowPayment(
    order: Order
): Promise<PaymentDefinition | null> {
    if (window.ethereum) {
        try {
            const escrow = await createEscrowContract(order);
            const payment = await escrow.getPayment(
                keccak256(toUtf8Bytes(order.id))
            );

            return paymentIsValid(payment) ? payment : null;
        } catch (e: any) {
            console.error('Error in getEscrowPayment:', e); // Log the error
            return null; // Return null instead of throwing
        }
    } else {
        console.error('No web3 provider available');
        return null; // Return null if no web3 provider is available
    }
}

//VALIDATION METHODS

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

function validatePaymentExists(
    payment: PaymentDefinition | null,
    orderId: string
) {
    const displayOrderId = orderId.replace(/^order_/, '');
    if (!payment || !paymentIsValid(payment)) {
        throw new Error(`Payment ${displayOrderId} not found.`);
    }
}

function validatePaymentNotReleased(
    payment: PaymentDefinition | null,
    orderId: string
) {
    const displayOrderId = orderId.replace(/^order_/, '');
    if (payment?.released) {
        throw new Error(
            `Escrow payment for ${displayOrderId} has already been released.`
        );
    }
}

function validatePaymentNotReleasedBySeller(
    payment: PaymentDefinition | null,
    orderId: string
) {
    const displayOrderId = orderId.replace(/^order_/, '');
    if (payment?.receiverReleased) {
        throw new Error(
            `Escrow payment for ${displayOrderId} has already been released by the seller.`
        );
    }
}

function validateRefundAmount(
    payment: PaymentDefinition | null,
    orderId: string,
    amount: BigNumberish
) {
    const displayOrderId = orderId.replace(/^order_/, '');
    const refundableAmt =
        BigInt(payment?.amount.toString() ?? '0') -
        BigInt(payment?.amountRefunded.toString() ?? '0');

    if (refundableAmt < BigInt(amount.toString())) {
        throw new Error(
            `Amount of ${amount} exceeds the refundable amount of ${refundableAmt} for ${displayOrderId}.`
        );
    }
}
