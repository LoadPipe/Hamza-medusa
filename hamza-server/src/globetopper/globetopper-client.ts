import axios from 'axios';
import querystring from 'querystring';

/**
 * Input data for purchase at point-of-sale; required params only.
 */
export type GTPurchaseInputData = {
    productID: string;
    amount: string;
    first_name: string;
    last_name: string;
    email: string;
    order_id: string;
};

/**
 * Just a local utility function.
 */
function appendQuerystring(url: string, key: string, value: string): string {
    const param = `${key}=${value}`;
    url += url.includes('?') ? `?${param}` : `&${param}`;
    return url;
}

/**
 * Wraps the Globetopper API calls that we actually use.
 */
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

    /**
     * Gets some permanent but also some more transient product data (more suitable for
     * calling to get product updates on existing products). More detailed data than
     * get catalogue.
     *
     * @param productId Optional; pass to get just one specific product.
     * @param countryCode Optional; filter by associated country (does not guarantee geo-restriction,
     * or currency, or anything)
     * @returns Bunch o data
     */
    public async getCatalog(
        productId?: string,
        countryCode?: string
    ): Promise<any> {
        let url: string = `${this.baseUrl}/catalogue/search-catalogue`;
        if (countryCode)
            url = appendQuerystring(url, 'countryCode', countryCode);
        if (productId) url = appendQuerystring(url, 'productID', productId);

        const output: any = axios.get(url, {
            headers: {
                authorization: 'Bearer ' + this.bearerAuthHeader,
            },
        });

        return output?.data;
    }

    /**
     * Gets static and non-detailed product data; best for importing.
     *
     * @param categoryID Optional; filter by category.
     * @param typeID Optional; but not sure what this is.
     * @param countryCode Optional; filter by associated country (does not guarantee geo-restriction,
     * or currency, or anything)
     * @returns Bunch o data
     */
    public async searchProducts(
        countryCode?: string,
        currencyCode?: string,
        categoryId?: string,
        typeId?: string
    ): Promise<any> {
        let url: string = `${this.baseUrl}/product/search-all-products`;
        if (countryCode)
            url = appendQuerystring(url, 'countryCode', countryCode);
        if (categoryId) url = appendQuerystring(url, 'categoryID', categoryId);
        if (typeId) url = appendQuerystring(url, 'typeID', typeId);
        const output: any = axios.get(url, {
            headers: {
                authorization: 'Bearer ' + this.bearerAuthHeader,
            },
        });

        let data = output?.data;
        if (currencyCode && data) {
            data = data.map(
                (i) => i?.operator?.currency?.code === currencyCode
            );
        }

        return data;
    }

    /**
     * Call at point-of-sale to purchase a gift card, after the customer has paid.
     *
     * @param data See GTPurchaseInputData
     * @returns Bunch o data
     * @todo (re)implement as a worker
     */
    public async purchase(input: GTPurchaseInputData): Promise<any> {
        console.log('input:', input);
        let url: string = `${this.baseUrl}/transaction/do-by-product/${input.productID}/${input.amount}`;
        console.log(url);

        //create the post data
        const { email, first_name, last_name, order_id } = input;
        const data = {
            email,
            first_name,
            last_name,
            order_id: 123456,
        };

        //send request
        return axios.post(url, querystring.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                authorization: 'Bearer ' + this.bearerAuthHeader,
            },
        });
    }
}
