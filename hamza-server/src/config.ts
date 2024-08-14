export class Config {
    public static get checkoutMode(): string | undefined {
        return process.env.CHECKOUT_MODE?.trim()?.toUpperCase();
    }

    public static get dataSeed(): string | undefined {
        return process.env.DATASEED?.trim()?.toLowerCase();
    }

    public static get allConfig() {
        return {
            checkout_mode: this.checkoutMode,
            data_seed: this.dataSeed
        };
    }
}
