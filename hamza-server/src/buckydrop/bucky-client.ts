import axios, { AxiosInstance } from 'axios';
import { createHash } from 'crypto';

const BUCKY_URL = process.env.BUCKY_URL || 'https://dev.buckydrop.com';
const APP_CODE = process.env.APP_CODE || '0077651952683977';
const APP_SECRET = process.env.APP_SECRET || 'b9486ca7a7654a8f863b3dfbd9e8c100';

export class BuckyClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: BUCKY_URL,
            headers: {
                'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
                'Content-Type': 'application/json',
            },
            timeout: 13000, // Optional: sets a timeout limit for requests
        });
    }

    // Method to calculate MD5 signature
    private generateSignature(params: string, timestamp: number): string {
        const hash = createHash('md5');
        const data = `${APP_CODE}${params}${timestamp}${APP_SECRET}`;
        return hash.update(data).digest('hex');
    }

    // Method to get product details
    async getProductDetails(productLink: string): Promise<any> {
        const params = JSON.stringify({ productLink });
        const timestamp = Date.now(); // Current timestamp in milliseconds
        const sign = this.generateSignature(params, timestamp);

        return this.client
            .post(
                `/api/rest/v2/adapt/openapi/product/detail?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`,
                params
            )
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    }
}

// Usage example (make sure to set the appropriate environment variables or default values)
const buckyClient = new BuckyClient();
buckyClient
    .getProductDetails('https://detail.1688.com/offer/592228806840.html')
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
