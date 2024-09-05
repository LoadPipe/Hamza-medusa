import axios, { AxiosInstance } from 'axios';
import { createHash } from 'crypto';
import { BuckyLogRepository } from 'src/repositories/bucky-log';
import { generateEntityId, Logger } from '@medusajs/medusa';

const BUCKY_URL = process.env.BUCKY_URL || 'https://dev.buckydrop.com';
const APP_CODE = process.env.BUCKY_APP_CODE || '0077651952683977';
const APP_SECRET =
    process.env.BUCKY_APP_SECRET || 'b9486ca7a7654a8f863b3dfbd9e8c100';

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
    private readonly repository: typeof BuckyLogRepository;

    constructor(container) {
        this.client = axios.create({
            baseURL: BUCKY_URL,
            headers: {
                'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
                'Content-Type': 'application/json',
            },
            timeout: 13000, // Optional: sets a timeout limit for requests
        });
        this.repository = container.buckyLogRepository;
    }

    // Method to get product details
    async getProductDetails(productLink: string): Promise<any> {
        const params = JSON.stringify({
            goodsLink: productLink,
        });

        return this.client
            .post(
                //`/api/rest/v2/adapt/openapi/product/detail?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`,
                this.formatApiUrl('product/query', params), //`/api/rest/v2/adapt/adaptation/product/query?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`,
                params,
                { timeout: 600000 }
            )
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    }

    async searchProducts(
        keyword: string,
        currentPage: number = 1,
        pageSize: number = 10
    ): Promise<any[]> {
        const params = JSON.stringify({
            curent: currentPage, // Note the typo "curent" should be "current" if API docs are correct
            size: pageSize,
            item: { keyword: keyword },
        });

        return this.client
            .post(
                //`/api/rest/v2/adapt/openapi/product/search?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`,
                this.formatApiUrl('/product/search', params), //?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`,
                params,
                { timeout: 600000 }
            )
            .then((response) => response.data?.data?.records)
            .catch((error) => {
                throw error;
            });
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

        return (
            this.client
                //TODO: get correct url for this
                .post(
                    //TODO: use adapt/adaptation url here
                    ``,
                    //`/api/rest/v2/adapt/openapi/product/image-search?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`,
                    params,
                    { timeout: 600000 }
                )
                .then((response) => response.data)
                .catch((error) => {
                    throw error;
                })
        );
    }

    async listProductCategories(): Promise<any> {
        const params = ''; // Assuming no body is required
        const timestamp = Date.now();
        const sign = this.generateSignature(params, timestamp);

        //TODO: add more detailed parameters
        return this.client
            .get(
                //TODO: use adapt/adaptation url here
                ``
                //`/api/rest/v2/adapt/openapi/product/category/list-tree?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}?lang=en`
                //`/api/rest/v2/adapt/openapi/product/category/list-tree?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`
            )
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    }

    //TODO: create type IBuckyOrderOutput
    async createOrder(
        createOrderParams: ICreateBuckyOrderParams
    ): Promise<any> {
        const params = JSON.stringify(createOrderParams);

        return this.client
            .post(
                this.formatApiUrl('/order/shop-order/create', params), //?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`,
                //`/api/rest/v2/adapt/openapi/order/create?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`,
                params
            )
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    }

    async cancelShopOrder(
        shopOrderNo: string,
        partnerOrderNo?: string
    ): Promise<any> {
        const params = JSON.stringify({
            shopOrderNo,
            partnerOrderNo,
        });

        return this.client
            .post(
                this.formatApiUrl('/order/shop-order/cancel', params), //?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`,
                //`/api/rest/v2/adapt/openapi/order/cancel?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`,
                params,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    }

    async cancelPurchaseOrder(orderCode: string): Promise<any> {
        const params = JSON.stringify({
            orderCode,
        });

        return this.client
            .post(this.formatApiUrl('/order/po-cancel', params), params, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    }

    async getOrderDetails(
        shopOrderNo: string,
        partnerOrderNo?: string
    ): Promise<any> {
        const params = JSON.stringify({
            shopOrderNo,
            partnerOrderNo,
        });

        return this.client
            .post(
                this.formatApiUrl('/order/detail', params), //?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`,
                //`/api/rest/v2/adapt/openapi/order/detail?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`,
                params
            )
            .then((response) => response.data)
            .catch((error) => {
                console.error(error);
                throw error;
            });
    }

    async getLogisticsInfo(packageCode: string): Promise<any> {
        const params = JSON.stringify({ packageCode });
        return this.client
            .post(this.formatApiUrl('/logistics/query-info', params), params) //query-info?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`, params)
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    }

    async getParcelDetails(packageCode: string): Promise<any> {
        const params = JSON.stringify({ packageCode });
        return this.client
            .post(this.formatApiUrl('/pkg/detail', params), params)
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    }

    async getShippingCostEstimate(
        item: IBuckyShippingCostRequest
    ): Promise<any> {
        const params = JSON.stringify({ size: 10, item });
        return this.client
            .post(
                this.formatApiUrl('/logistics/channel-carriage-list', params),
                params
            )
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    }

    private formatApiUrl(route: string, params: any = {}): string {
        route = route.trim();
        if (!route.startsWith('/')) route = '/' + route;
        const timestamp = Date.now();
        const sign = this.generateSignature(params, timestamp);
        const url = `/api/rest/v2/adapt/adaptation${route}?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`;
        console.log(url);
        return url;
    }

    // Method to calculate MD5 signature
    private generateSignature(params: string, timestamp: number): string {
        const hash = createHash('md5');
        const data = `${APP_CODE}${params}${timestamp}${APP_SECRET}`;
        return hash.update(data).digest('hex');
    }

    private saveEntry(endpoint: string, input: any, output: any, context: any) {
        const entry = {
            endpoint,
            input,
            output,
            context,
            timestamp: Date.now(), // ISO formatted timestamp
            id: generateEntityId(),
        };
        this.repository?.save(entry);
    }
}
