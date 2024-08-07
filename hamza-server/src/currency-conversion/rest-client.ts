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
        // const standardAddresses = {
        //     '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58':
        //         '0xdac17f958d2ee523a2206206994597c13d831ec7', // Non-standard to standard USDT
        //     '0x45b24160da2ca92673b6caf4dfd11f60adac73e3':
        //         '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // Non-standard to standard USDC
        // };
        //
        // baseCurrency = baseCurrency.toLowerCase().trim();
        // toCurrency = toCurrency.toLowerCase().trim();
        //
        // // Remap addresses to standard if applicable
        // baseCurrency = standardAddresses[baseCurrency] || baseCurrency;
        // toCurrency = standardAddresses[toCurrency] || toCurrency;
        //
        // if (baseCurrency === toCurrency) {
        //     console.log(
        //         `Base and to currencies are the same: ${baseCurrency}, returning 1`
        //     );
        //     return 1;
        // }
        //
        // const url = `/convert/exch?base=${baseCurrency}&to=${toCurrency}`;
        // console.log('Request URL:', url);
        //
        // try {
        //     const response = await this.client.get(url);
        //     console.log('HTTP Response Data:', response.data);
        //     return response.status === 200 ? parseFloat(response.data) : 1;
        // } catch (error) {
        //     console.error('Error getting exchange rate:', error.message);
        //     return 1;
        // }
        try {
            const url = `/exch?base=${baseCurrency}&to=${toCurrency}`;
            console.log('getting exchange rate', url);

            if (baseCurrency === toCurrency) return 1;

            //hard-coded for testing
            switch (baseCurrency) {
                case '0x0000000000000000000000000000000000000000':
                    return 2517.26;
                default:
                    return 0.00041;
            }

            const response = await this.client.get(url);
            return response.status === 200 ? response.data : 1;
        } catch (error) {
            console.error('Error getting exchange rate:', error.message);
            return 1;
        }
    }
}
