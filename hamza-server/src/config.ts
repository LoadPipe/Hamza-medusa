export class Config {
    public static getCheckoutMode(): string | undefined {
        return process.env.CHECKOUT_MODE?.trim()?.toUpperCase();
    }

    public static getAllConfigs() {
        return {
            checkoutMode: this.getCheckoutMode(),
            // Random mock data
            configStuff: true,
            grog: 'full',
        };
    }
}
