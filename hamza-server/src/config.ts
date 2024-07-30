export class Config {
    public static getPaymentMode(): string | undefined {
        console.log('getPaymentMode Procd', process.env.PAYMENT_MODE);
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
