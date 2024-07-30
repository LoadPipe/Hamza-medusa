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
    public static getStoreUrl(): string {
        return process.env.STORE_URL || 'http://localhost:8000';
    }

    public static getAllConfigs() {
        return {
            paymentMode: this.getPaymentMode(),
            storeUrl: this.getStoreUrl(),
            // Random mock data
            configStuff: true,
            grog: 'full',
        };
    }
}
