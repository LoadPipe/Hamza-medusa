import axios from 'axios';

export class GlobetopperClient {
    protected readonly baseUrl: string;
    protected readonly bearerAuthHeader: string;

    constructor() {
        this.baseUrl = process.env.GLOBETOPPER_API_URL;
        this.bearerAuthHeader =
            process.env.GLOBETOPPER_API_KEY +
            ':' +
            process.env.GLOBETOPPER_SECRET;
    }

    public async getCatalog(): Promise<any> {
        return axios.get(`${this.baseUrl}/catalogue/search-catalogue`, {
            headers: {
                authorization: 'Bearer ' + this.bearerAuthHeader,
            },
        });
    }

    public async searchProducts(): Promise<any> {
        return axios.get(`${this.baseUrl}/product/search-all-products`, {
            headers: {
                authorization: 'Bearer ' + this.bearerAuthHeader,
            },
        });
    }
}
