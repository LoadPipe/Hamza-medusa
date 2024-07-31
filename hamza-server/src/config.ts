export class Config {
    public static getPaymentMode(): string | undefined {
        return 'FAKE';
        return process.env.PAYMENT_MODE;
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
