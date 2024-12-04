import axios from 'axios';

export type GTPurchaseInputData = {
    productID: string;
    amount: number;
    first_name: string;
    last_name: string;
    email: string;
    order_id: string;
};

function appendQuerystring(url: string, key: string, value: string): string {
    const param = `${key}=${value}`;
    url += url.includes('?') ? `?${param}` : `&${param}`;
    return url;
}

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

    public async getCatalog(
        productId?: string,
        countryCode?: string
    ): Promise<any> {
        let url: string = `${this.baseUrl}/catalogue/search-catalogue`;
        if (countryCode)
            url = appendQuerystring(url, 'countryCode', countryCode);
        if (productId) url = appendQuerystring(url, 'productID', productId);

        return axios.get(url, {
            headers: {
                authorization: 'Bearer ' + this.bearerAuthHeader,
            },
        });
    }

    public async searchProducts(
        countryCode?: string,
        categoryId?: string,
        typeId?: string
    ): Promise<any> {
        let url: string = `${this.baseUrl}/product/search-all-products`;
        if (countryCode)
            url = appendQuerystring(url, 'countryCode', countryCode);
        if (categoryId) url = appendQuerystring(url, 'categoryID', categoryId);
        if (typeId) url = appendQuerystring(url, 'typeID', typeId);
        return axios.get(url, {
            headers: {
                authorization: 'Bearer ' + this.bearerAuthHeader,
            },
        });
    }

    public async purchase(data: GTPurchaseInputData): Promise<any> {
        let url: string = `${this.baseUrl}/product/search-all-products`;
        return axios.post(url, data, {
            headers: {
                authorization: 'Bearer ' + this.bearerAuthHeader,
            },
        });
    }
}
