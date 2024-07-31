export class Config {
    public static getPaymentMode(): string | undefined {
        return process.env.PAYMENT_MODE?.trim()?.toUpperCase();
    }

    public static getAllConfigs() {
        return {
            paymentMode: this.getPaymentMode(),
            // Random mock data
            configStuff: true,
            grog: 'full',
        };
    }
}
