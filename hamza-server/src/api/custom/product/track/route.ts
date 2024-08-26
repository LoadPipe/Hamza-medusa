import { MedusaRequest, MedusaResponse, ProductStatus } from '@medusajs/medusa';
import ProductService, {
    BulkImportProductInput,
} from '../../../../services/product';
import { RouteHandler } from '../../../route-handler';
import { BuckyClient } from '../../../../buckydrop/bucky-client';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    let productService: ProductService = req.scope.resolve('productService');
    const handler: RouteHandler = new RouteHandler(req, res, 'POST', '/custom/product/track');


    /*
{"success":true,"data":
{"partnerOrderNo":"order01J57E1FFZC1ZZT2JKJ43R0X6C","partnerOrderRemark":"",
"shopOrderNo":"CO172360526156200001","orderNo":"CO172360526156200001","currency":"CNY",
"country":"CANADA","countryCode":"ca","province":"434","city":"new york",
"detailAddress":"zoot","postcode":"22332","contactPhone":"0809997747",
"contactName":"john. kosinski",
"email":"0x8ba35513c3f5ac659907d222e3dab38b20f8f52a@evm.blockchain","productList":
[{"productName":"Deli 18700 Children Count Rope Skipping God Primary School Entrance Examination Adjustable Rope Wholesale Examination Sporting Goods","productCount":1,"productLink":"https://detail.1688.com/offer/661007997656.html","productPrice":"6.72","salePrice":"6.72","spuCode":"661007997656","skuCode":"4847523353074","platform":"ALIBABA","productUniqueCode":"ALIBABA_661007997656_4847523353074"}]},"code":0,"info":"Success","currentTime":1723605261889}
    */
    await handler.handle(async () => {
        const buckyClient = new BuckyClient();

        await buckyClient.getOrderDetails('order01J57E1FFZC1ZZT2JKJ43R0X6C', 'CO172360526156200001');
        return res.send({});
    });
};
