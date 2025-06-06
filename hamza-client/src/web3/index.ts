import { BigNumberish, ethers } from 'ethers';
import { HexString } from 'ethers/lib.commonjs/utils/data';

/**
 * Input params to a single payment to the Massmarket contract.
 */
export interface IPaymentInput {
    id: BigNumberish;
    receiver: HexString; //contract address
    payer: HexString;
    amount: BigNumberish;
    currency?: string; //token address, or ethers.ZeroAddress for native
    orderId: HexString; //massmarket order id
    storeId: HexString; //massmarket store id
    chainId: number;
    massmarketOrderId: string;
    massmarketAmount: string;
    massmarketTtl: number;
}

/**
 * Input params to a single payment to the Switch.
 */
export interface ISwitchPaymentInput {
    id: BigNumberish;
    orderId?: string;
    receiver: HexString; //contract address
    payer: HexString;
    amount: BigNumberish;
}

/**
 * Output from a Switch transaction execution.
 */
export interface ITransactionOutput {
    transaction_id: string;
    tx: any;
    receipt: any;
}

/**
 * Input params for multiple concurrent payments to the switch.
 */
export interface IMultiPaymentInput {
    receiver: string;
    currency: string; //token address, or ethers.ZeroAddress for native
    payments: IPaymentInput[];
}

/**
 * Input params for multiple concurrent payments to the switch.
 */
export interface ISwitchMultiPaymentInput {
    currency: string; //token address, or ethers.ZeroAddress for native
    payments: ISwitchPaymentInput[];
}

/**
 * Gets the chain id for the current signed in wallet.
 */
export async function getChainId(): Promise<bigint> {
    const provider: ethers.BrowserProvider = new ethers.BrowserProvider(
        window.ethereum as ethers.Eip1193Provider
    );
    const { chainId } = await provider.getNetwork();
    return chainId;
}

/**
 * Gets the address of the current signed in wallet.
 */
export async function getWalletAddress(): Promise<string> {
    const provider: ethers.BrowserProvider = new ethers.BrowserProvider(
        window.ethereum as ethers.Eip1193Provider
    );
    const signer: ethers.Signer = await provider.getSigner();
    return await signer.getAddress();
}
