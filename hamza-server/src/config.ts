import dotenv from 'dotenv';
dotenv.config();
const STORE_URL = process.env.STORE_URL || 'http://localhost:8000';
import axios from 'axios';
// config.ts
export class Config {
    public static getPaymentMode(): string | undefined {
        console.log('getPaymentMode Procd');
        return process.env.PAYMENT_MODE;
    }

    // public static async fetchPaymentMode() {
    //     try {
    //         const response = await axios.get(
    //             `${STORE_URL}/custom/payment-mode`
    //         );
    //         if (response.status === 200 && response.data.payment_mode) {
    //             return response.data.payment_mode;
    //         } else {
    //             console.error(
    //                 'Failed to fetch payment mode: ',
    //                 response.status
    //             );
    //             return undefined;
    //         }
    //     } catch (error) {
    //         console.error('Error fetching payment mode: ', error);
    //         return undefined;
    //     }
    // }
}
