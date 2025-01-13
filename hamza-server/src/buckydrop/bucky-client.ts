import axios, { AxiosInstance } from 'axios';
import { createHash } from 'crypto';
import { ExternalApiLogRepository } from 'src/repositories/external-api-log';
import { generateEntityId, Logger } from '@medusajs/medusa';
import { ExternalApiLog } from 'src/models/external-api-log';

export interface CancelOrderParams {
    partnerOrderNo?: string;
    shopOrderNo?: string;
}

export interface ICreateBuckyOrderProduct {
    spuCode: string;
    skuCode: string;
    productCount: number;
    platform: string;
    productPrice: number;
    productName: string;
}

export interface ICreateBuckyOrderParams {
    partnerOrderNo: string;
    partnerOrderNoName?: string;
    country: string;
    countryCode: string;
    province: string;
    city: string;
    detailAddress: string;
    postCode: string;
    contactName: string;
    contactPhone: string;
    email: string;
    orderRemark: string;
    productList: ICreateBuckyOrderProduct[];
}

export interface IBuckyShippingCostRequest {
    lang: string;
    country: string;
    countryCode: string;
    provinceCode: string;
    province: string;
    detailAddress: string;
    postCode: string;
    orderBy?: string;
    orderType?: string;

    productList: {
        length: number;
        width: number;
        height: number;
        weight: number;
        count?: number;
        categoryCode: string;
        goodsPrice?: string;
        productNameCn?: string;
        productNameEn?: string;
        categoryName?: string;
        goodsAttrCode?: string;
    }[];
}

//TODO: comment the methods
//TODO: proper return types

export class BuckyClient {
    private client: AxiosInstance;
    protected readonly externalApiLogRepository: typeof ExternalApiLogRepository;
    protected readonly BUCKY_URL: string;
    protected readonly APP_CODE: string;
    protected readonly APP_SECRET: string;

    constructor(externalApiLogRepository: typeof ExternalApiLogRepository) {
        this.BUCKY_URL = process.env.BUCKY_URL || 'https://dev.buckydrop.com';
        this.APP_CODE = process.env.BUCKY_APP_CODE || '0077651952683977';
        this.APP_SECRET =
            process.env.BUCKY_APP_SECRET || 'b9486ca7a7654a8f863b3dfbd9e8c100';

        this.client = axios.create({
            baseURL: this.BUCKY_URL,
            headers: {
                'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
                'Content-Type': 'application/json',
            },
            timeout: 13000,
        });
        this.externalApiLogRepository = externalApiLogRepository;
    }

    private async post(url: string, params: any): Promise<any> {
        url = this.formatApiUrl(url, JSON.stringify(params));

        const logRecord = await this.saveLogInput(url, params, null, null);

        const output = await this.client
            .post(url, params, { timeout: 600000 })
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });

        if (logRecord) {
            logRecord.output = output;
            this.saveLogOutput(logRecord);
        }

        return output;
    }

    // Method to get product details
    async getProductDetails(productLink: string): Promise<any> {
        return this.post('product/query', {
            goodsLink: productLink,
        });
    }

    async searchProducts(
        keyword: string,
        currentPage: number = 1,
        pageSize: number = 10
    ): Promise<any[]> {
        return (
            await this.post('product/search', {
                curent: currentPage, // Note the typo "curent" should be "current" if API docs are correct
                size: pageSize,
                item: { keyword: keyword },
            })
        )?.data?.records;
    }

    async searchProductByImage(
        base64Image,
        currentPage = 1,
        pageSize = 10
    ): Promise<any> {
        const params = JSON.stringify({
            curent: currentPage,
            size: pageSize,
            item: { base64: base64Image },
        });
        const timestamp = Date.now();
        const sign = this.generateSignature(params, timestamp);

        //TODO: get correct url for this
        return this.post('', params);
    }

    async createOrder(
        createOrderParams: ICreateBuckyOrderParams
    ): Promise<any> {
        return this.post('/order/shop-order/create', createOrderParams);
    }

    async cancelShopOrder(
        shopOrderNo: string,
        partnerOrderNo?: string
    ): Promise<any> {
        return this.post('/order/shop-order/cancel', {
            shopOrderNo,
            partnerOrderNo,
        });
    }

    async cancelPurchaseOrder(orderCode: string): Promise<any> {
        return this.post('/order/po-cancel', { orderCode });
    }

    async getOrderDetails(
        shopOrderNo: string,
        partnerOrderNo?: string
    ): Promise<any> {
        return this.post('/order/detail', {
            shopOrderNo,
            partnerOrderNo,
        });
    }

    async getLogisticsInfo(packageCode: string): Promise<any> {
        return this.post('/logistics/query-info', { packageCode });
    }

    async getParcelDetails(packageCode: string): Promise<any> {
        return this.post('/pkg/detail', { packageCode });
    }

    async getShippingCostEstimate(
        item: IBuckyShippingCostRequest
    ): Promise<any> {
        return this.post('/logistics/channel-carriage-list', {
            size: 10,
            item,
        });
    }

    private formatApiUrl(route: string, params: any = {}): string {
        route = route.trim();
        if (!route.startsWith('/')) route = '/' + route;
        const timestamp = Date.now();
        const sign = this.generateSignature(params, timestamp);
        const url = `/api/rest/v2/adapt/adaptation${route}?appCode=${this.APP_CODE}&timestamp=${timestamp}&sign=${sign}`;
        console.log(url);
        return url;
    }

    // Method to calculate MD5 signature
    private generateSignature(params: string, timestamp: number): string {
        const hash = createHash('md5');
        const data = `${this.APP_CODE}${params}${timestamp}${this.APP_SECRET}`;
        return hash.update(data).digest('hex');
    }

    //TODO: need logger also
    private async saveLogInput(
        endpoint: string,
        input: any,
        output: any,
        context: any
    ): Promise<ExternalApiLog> {
        try {
            const entry = {
                endpoint,
                api_source: 'buckydrop',
                input,
                output,
                context,
                id: generateEntityId(),
            };
            const record = await this.externalApiLogRepository?.save(entry);
            return record;
        } catch (e) {
            console.error(e);
        }

        return null;
    }

    //TODO: need logger also
    private async saveLogOutput(record: ExternalApiLog): Promise<void> {
        try {
            await this.externalApiLogRepository?.save(record);
        } catch (e) {
            console.error(e);
        }

        return null;
    }
}
