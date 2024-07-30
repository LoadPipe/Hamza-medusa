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
}
