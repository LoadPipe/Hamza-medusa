import axios from 'axios';
import querystring from 'querystring';
import { ExternalApiLogRepository } from '../repositories/external-api-log';
import { ExternalApiLog } from '../models/external-api-log';
import { generateEntityId } from '@medusajs/medusa';
import { ILogger } from '../utils/logging/logger';

/**
 * Input data for purchase at point-of-sale; required params only.
 */
export type GTPurchaseInputData = {
    productID: string;
    amount: string;
    first_name: string;
    last_name: string;
    email: string;
    order_id: number;
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
    protected readonly externalApiLogRepository: typeof ExternalApiLogRepository;
    protected readonly logger: ILogger;

    constructor(
        logger: ILogger,
        externalApiLogRepository: typeof ExternalApiLogRepository
    ) {
        this.baseUrl = process.env.GLOBETOPPER_API_URL;
        this.bearerAuthHeader =
            process.env.GLOBETOPPER_API_KEY +
            ':' +
            process.env.GLOBETOPPER_SECRET;
        this.logger = logger;
        this.externalApiLogRepository = externalApiLogRepository;
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

        const output: any = await axios.get(url, {
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
        const output: any = await axios.get(url, {
            headers: {
                authorization: 'Bearer ' + this.bearerAuthHeader,
            },
        });

        let data = output?.data;
        if (currencyCode && data?.records) {
            data.records = data.records.filter(
                (i) => i?.operator?.country?.currency?.code === currencyCode
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
        let url: string = `${this.baseUrl}/transaction/do-by-product/${input.productID}/${input.amount}`;

        //create the post data
        const { email, first_name, last_name, order_id } = input;
        const data = {
            email,
            first_name,
            last_name,
            order_id,
        };
        this.logger?.debug(`Calling ${url} ${data}`);

        //save log record before calling
        const logRecord = await this.saveLogInput(url, data);

        //send request
        try {
            const output = await axios.post(url, querystring.stringify(data), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    authorization: 'Bearer ' + this.bearerAuthHeader,
                },
            });

            //save with output after calling
            await this.saveLogOutput(logRecord, output?.data);

            //and return output
            return output;
        } catch (e: any) {
            this.logger?.error(
                `Error calling purchase api for globetopper: ${e}`
            );
            await this.saveLogOutput(logRecord, { error: e.toString() });
            return null;
        }
    }

    //TODO: maybe move to its own service
    private async saveLogInput(
        endpoint: string,
        input: any
    ): Promise<ExternalApiLog> {
        try {
            const entry = {
                endpoint,
                api_source: 'globetopper',
                input,
                id: generateEntityId(),
            };

            const record = await this.externalApiLogRepository?.save(entry);
            return record;
        } catch (e) {
            console.error(e);
            this.logger?.error(
                `Error logging external api input log for globetopper: ${e}`
            );
            console.error(e);
        }

        return null;
    }

    //TODO: maybe move to its own service
    private async saveLogOutput(
        record: ExternalApiLog,
        output: any
    ): Promise<ExternalApiLog> {
        try {
            record.output = output;
            await this.externalApiLogRepository?.save(record);
        } catch (e) {
            this.logger?.error(
                `Error logging external api output log for globetopper: ${e}`
            );
            console.error(e);
        }

        return record;
    }
}
