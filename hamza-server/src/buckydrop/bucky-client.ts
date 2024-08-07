import axios, { AxiosInstance } from 'axios';
import { createHash } from 'crypto';

const BUCKY_URL = process.env.BUCKY_URL || 'https://dev.buckydrop.com';
const APP_CODE = process.env.APP_CODE || '0077651952683977';
const APP_SECRET = process.env.APP_SECRET || 'b9486ca7a7654a8f863b3dfbd9e8c100';

interface CancelOrderParams {
    partnerOrderNo?: string;
    orderNo?: string;
}

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

    async searchProducts(
        keyword: string,
        currentPage: number = 1,
        pageSize: number = 10
    ): Promise<any> {
        const params = JSON.stringify({
            curent: currentPage, // Note the typo "curent" should be "current" if API docs are correct
            size: pageSize,
            item: { keyword: keyword },
        });
        const timestamp = Date.now();
        const sign = this.generateSignature(params, timestamp);

        return this.client
            .post(
                `/api/rest/v2/adapt/openapi/product/search?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`,
                params
            )
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    }

    async searchProductByImage(base64Image, currentPage = 1, pageSize = 10) {
        const params = JSON.stringify({
            curent: currentPage,
            size: pageSize,
            item: { base64: base64Image },
        });
        const timestamp = Date.now();
        const sign = this.generateSignature(params, timestamp);

        return this.client
            .post(
                `/api/rest/v2/adapt/openapi/product/image-search?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`,
                params
            )
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    }

    async listProductCategories() {
        const params = ''; // Assuming no body is required
        const timestamp = Date.now();
        const sign = this.generateSignature(params, timestamp);

        return this.client
            .get(
                `/api/rest/v2/adapt/openapi/product/category/list-tree?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`
            )
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    }

    async createOrder(orderDetails) {
        const params = JSON.stringify(orderDetails);
        const timestamp = Date.now();
        const sign = this.generateSignature(params, timestamp);

        return this.client
            .post(
                `/api/rest/v2/adapt/openapi/order/create?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`,
                params
            )
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    }

    async cancelOrder(partnerOrderNo?: string, orderNo?: string) {
        const bodyParams: CancelOrderParams = {};
        if (partnerOrderNo) bodyParams.partnerOrderNo = partnerOrderNo;
        if (orderNo) bodyParams.orderNo = orderNo;

        const params = JSON.stringify(bodyParams);
        const timestamp = Date.now();
        const sign = this.generateSignature(params, timestamp);

        return this.client
            .post(
                `/api/rest/v2/adapt/openapi/order/cancel?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`,
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

    async getOrderDetails(orderId) {
        const params = JSON.stringify({ orderId });
        const timestamp = Date.now();
        const sign = this.generateSignature(params, timestamp);

        return this.client
            .post(
                `/api/rest/v2/adapt/openapi/order/detail?appCode=${APP_CODE}&timestamp=${timestamp}&sign=${sign}`,
                params
            )
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    }

    async getLogisticsInfo(packageCode) {
        const params = JSON.stringify({ packageCode });
        // other setup like timestamp, appCode, sign, etc.
        return this.client
            .post(`/api/rest/v2/adapt/adaptation/logistics/query-info`, params)
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    }
}

const buckyClient = new BuckyClient();

// PRODUCT QUERIES
// Call to get product details
// buckyClient
//     .getProductDetails('https://detail.1688.com/offer/592228806840.html')
//     .then((data) => console.log('Product Details:', JSON.stringify(data)))
//     .catch((error) => console.error('Error fetching product details:', error));

// // Call to search products based on a keyword
buckyClient
    .searchProducts('cup', 1, 10)
    .then((data) => console.log('Search Results:', JSON.stringify(data)))
    .catch((error) => console.error('Error searching products:', error));

// buckyClient
//     .searchProductByImage('your_base64_encoded_image_here')
//     .then((data) => console.log('Image Search Results:', data))
//     .catch((error) => console.error('Error in image search:', error));
//
// // Call to list product categories in a tree structure
// buckyClient
//     .listProductCategories()
//     .then((data) => console.log('Product Categories:', data))
//     .catch((error) =>
//         console.error('Error listing product categories:', error)
//     );

// ORDER QUERIES

const createOrderData = {
    partnerOrderNo: 'p010101j',
    partnerOrderNoName: '01012',
    country: 'string',
    countryCode: 'st',
    province: 'string',
    city: 'string',
    detailAddress: 'string',
    postCode: 'string',
    contactName: 'string',
    contactPhone: 'string',
    email: 'string',
    orderRemark: 'string',
    productList: [
        {
            spuCode: 'string',
            skuCode: 'string',
            productCount: 100000,
            platform: 'ALIBABA',
            productPrice: 999999999,
            productName: 'string',
        },
    ],
};

// buckyClient
//     .createOrder(createOrderData)
//     .then((data) => console.log('Order Created:', data))
//     .catch((error) => console.error('Error creating order:', error));

// // Call to cancel an order
// buckyClient
//     .cancelOrder('p010101', 'CO172290269356400001')
//     .then((data) => console.log('Order Cancelled:', data))
//     .catch((error) => console.error('Error cancelling order:', error));

// // Call to get order details
// buckyClient
//     .getOrderDetails('your_order_id_here')
//     .then((data) => console.log('Order Details:', data))
//     .catch((error) => console.error('Error fetching order details:', error));

// buckyClient.getLogisticsInfo('BXD1234567890')
//     .then(data => console.log('Logistics Info:', data))
//     .catch(error => console.error('Error getting logistics info:', error));
