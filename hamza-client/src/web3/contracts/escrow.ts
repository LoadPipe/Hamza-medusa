import { BigNumberish, ethers } from 'ethers';
import { ISwitchMultiPaymentInput, ITransactionOutput } from '..';
import { getCurrencyAddress } from '../../currency.config';
import { EscrowBase } from './escrow-base';

export class EscrowClient extends EscrowBase {
    constructor(
        provider: ethers.Provider,
        signer: ethers.Signer,
        address: string
    ) {
        super(provider, signer, address);
    }

    async placeMultiplePayments(
        inputs: ISwitchMultiPaymentInput[],
        immediateSweep: boolean = true
    ): Promise<ITransactionOutput> {
        //prepare the inputs
        for (let n = 0; n < inputs.length; n++) {
            const input: ISwitchMultiPaymentInput = inputs[n];
            if (!input.currency || input.currency === 'eth') {
                input.currency = ethers.ZeroAddress;
            } else {
                if (!ethers.isAddress(input.currency)) {
                    input.currency = getCurrencyAddress(
                        input.currency,
                        parseInt(
                            (
                                await this.provider.getNetwork()
                            ).chainId.toString()
                        )
                    );
                }
            }
        }

        //make any necessary token approvals
        await this.approveAllTokens(this.contractAddress, inputs);

        //get total native amount
        const nativeTotal: BigNumberish = this.getNativeTotal(inputs);
        console.log('native amount:', nativeTotal);

        const tx: any = await this.contract.placeMultiPayments(
            inputs,
            immediateSweep,
            {
                value: nativeTotal,
            }
        );

        const transaction_id = tx.hash;
        const receipt = await tx.wait();

        return {
            transaction_id,
            tx,
            receipt,
        };
    }
}
