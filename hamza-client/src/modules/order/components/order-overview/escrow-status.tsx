import { PaymentDefinition } from '@/web3/contracts/escrow';

type EscrowStatusProps = {
    payment: PaymentDefinition;
};

/**
 * Uses the properties of the payment to come up with an appropriate escrow status to display.
 * @param payment PaymentDefinition from escrow
 * @returns string
 */
function getEscrowStatus(payment: PaymentDefinition): string {
    if (!payment) return '-';

    if (payment.payerReleased && !payment.receiverReleased)
        return 'buyer released';
    else if (payment.receiverReleased && !payment.payerReleased)
        return 'seller released';
    else if (payment.released) return 'released';

    //calculate if refunded or not
    const amount: BigInt = BigInt(payment.amount?.toString() ?? '0;');

    const refundableAmt: BigInt =
        BigInt(payment.amount?.toString() ?? '0') -
        BigInt(payment.amountRefunded?.toString() ?? '0');

    if (amount != BigInt(0) && refundableAmt == BigInt(0)) {
        return 'fully refunded';
    }

    return 'in escrow';
}

const EscrowStatus: React.FC<EscrowStatusProps> = ({ payment }: { payment: PaymentDefinition | null }) => {
    const status = payment ? getEscrowStatus(payment) : '-';

    return (
        <div className="p-4 bg-[#242424] rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
                <div className="flex flex-col space-y-1">
                    <h2 className="text-xl font-bold text-white">
                        Escrow Status
                    </h2>
                    <p className="text-sm font-semibold text-[#94d42a]">
                        {status}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EscrowStatus;
