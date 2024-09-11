import axios, { AxiosInstance } from 'axios';
//TODO: re-create this as a service
export type HexString = `0x${string}`;

const REST_URL =
    process.env.CURRENCY_CONVERSION_REST_URL || 'http://localhost:3000/convert';
try {
    new URL(REST_URL);
} catch (error) {
    console.error('Invalid REST_SERVER_URL:', REST_URL);
    process.exit(1); // Exit the process if the URL is invalid
}

export class CurrencyConversionClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: REST_URL,
            timeout: 13000,
        });
    }

    /**
     * Checks the status of the rest api server.
     *
     * @returns boolean, true if a-ok
     */
    async checkStatus(): Promise<boolean> {
        try {
            const response = await this.client.get('/');
            return response.status === 200;
        } catch (error) {
            console.error('Error checking status:', error.message);
            return false;
        }
    }

    /**
     * Checks the status of the rest api server.
     *
     * @returns boolean, true if a-ok
     */
    async getExchangeRate(
        baseCurrency: string,
        toCurrency: string
    ): Promise<number> {
        try {
            const url = `/exch?base=${baseCurrency}&to=${toCurrency}`;
            //console.log('getting exchange rate', url);

            if (baseCurrency === toCurrency) return 1;

            if (process.env.CURRENCY_CONVERSION_REST_URL) {
                const response = await this.client.get(url);
                return response.status === 200 ? response.data : 1;
            }

            //default: hard-coded rates
            switch (baseCurrency) {
                case '0x0000000000000000000000000000000000000000':
                    return 2517.26;
                case 'cny':
                    if (
                        toCurrency !==
                        '0x0000000000000000000000000000000000000000'
                    )
                        return 0.14;
                    else return 0.000051;
                default:
                    if (
                        toCurrency !==
                        '0x0000000000000000000000000000000000000000'
                    ) {
                        if (toCurrency === 'cny') return 7.14;
                        return 1;
                    }
                    return 0.00041;
            }
        } catch (error) {
            console.error('Error getting exchange rate:', error.message);
            return 1;
        }
    }
}
