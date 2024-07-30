import dotenv from 'dotenv';
dotenv.config();

// config.ts
export class Config {
    public static getPaymentMode(): string | undefined {
        console.log('getPaymentMode Procd');
        return process.env.PAYMENT_MODE;
    }
}
