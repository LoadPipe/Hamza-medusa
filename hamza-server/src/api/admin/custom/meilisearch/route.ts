import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import ProductService from '../../../../services/product';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler = new RouteHandler(
        req,
        res,
        'GET',
        '/admin/custom/meilisearch'
    );

    await handler.handle(async () => {
        const product = await productService.reindexProducts();
        if (product === null)
            return handler.returnStatusWithMessage(404, `Product not found`);

        return handler.returnStatus(200, product);
    });
};

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const productService: ProductService = req.scope.resolve('productService');

    const handler = new RouteHandler(
        req,
        res,
        'PUT',
        '/admin/custom/meilisearch'
    );

    await handler.handle(async () => {
        const products = await productService.getProductsForMeilisearchIndex();

        const response = await fetch(
            'http://localhost:7700/indexes/products/documents?primaryKey=id',
            {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    Authorization: 'Bearer Pybr4pq4eFjrKVQ79sSUJfp7O8tXNWJj',
                },
                body: JSON.stringify(products),
            }
        );

        return handler.returnStatus(200, products);
    });
    /*
        const response = await fetch('http://localhost:7700/indexes/products/documents?primaryKey=id', {
            method: "PUT",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                Authorization: 'Bearer Pybr4pq4eFjrKVQ79sSUJfp7O8tXNWJj',
            },
            body: JSON.stringify([
                {
                    "id": "prod_01J831AS9B4R9PPSGV1NSZ4T1K",
                    "handle": "mechanical-keyboard-rapoo-v700",
                    "title": "Rapoo V700 Mechanical Keyboard for Gaming - Responsive, Durable, and Customizable",
                    "description": "Rapoo V700 Mechanical Keyboard for Gaming - Responsive, Durable, and Customizable",
                    "thumbnail": "https://static.snapchum.com/SC004/main-plain.png"
                },
                {
                    "id": "prod_01J7ZZMP9WV591PHZ1BY8KW5ZB",
                    "handle": "raspberry-pi",
                    "title": "Raspberry Pi 4 Model B - Advanced Miniature Computer for Learning and Innovation",
                    "description": "Raspberry Pi 4 Model B - Advanced Miniature Computer for Learning and Innovation",
                    "thumbnail": "https://static.snapchum.com/SC009/main-plain.png"
                },
                {
                    "id": "prod_01J7ZZJYC8VAACQ4M1P8KH0NQJ",
                    "handle": "magsafe-power-bank",
                    "title": "Magsafe Magnetic Power Bank 10000mAh- Portable, Two-Way Fast Charging	",
                    "description": "Magsafe Magnetic Power Bank 10000mAh- Portable, Two-Way Fast Charging",
                    "thumbnail": "https://static.snapchum.com/SC006/main-plain.png"
                },
                {
                    "id": "prod_01J7XNT93Y86ZRPJ1C4JNN3502",
                    "handle": "dji-neo",
                    "title": "DJ Drone Mavic for Superior Aerial Photography",
                    "description": "DJ Drone Mavic for Superior Aerial Photography",
                    "thumbnail": "https://static.snapchum.com/SC014/main-plain.png"
                },
                {
                    "id": "prod_01J7Z1XGYV736N63GEEG933MWR",
                    "handle": "wireless-bluetooth-speakers",
                    "title": "Wireless Mini Bluetooth Speakers - Portable, Waterproof, Powerful Bass",
                    "description": "Wireless Mini Bluetooth Speakers - Portable, Waterproof, Powerful Bass",
                    "thumbnail": "https://static.snapchum.com/SC005/main-plain.png"
                },
                {
                    "id": "prod_01J831F9PS8Q42210GC6HTGGB4",
                    "handle": "mac-type-c-adapter",
                    "title": "Mac Type C Adapter - High-Speed Transfer, Compact Design, Wide Compatibility",
                    "description": "Mac Type C Adapter - High-Speed Transfer, Compact Design, Wide Compatibility",
                    "thumbnail": "https://static.snapchum.com/SC007/main-plain.png"
                },
                {
                    "id": "prod_01J832DRXDG00HV0M7E10BRS0M",
                    "handle": "xiaomi-airdots",
                    "title": "Xiaomi AirDots True Wireless Earbuds",
                    "description": "Xiaomi AirDots True Wireless Earbuds",
                    "thumbnail": "https://static.snapchum.com/SC012/main-plain.png"
                },
                {
                    "id": "prod_01J7WWNVCB2XX2PB372QNNDXEF",
                    "handle": "micro-sd-card",
                    "title": "Micro SD Card for Mobile Phones - Fast Transfer Speeds - Wide Compatibility",
                    "description": "Micro SD Card for Mobile Phones - Fast Transfer Speeds - Wide Compatibility",
                    "thumbnail": "https://static.snapchum.com/SC001/main-plain.png"
                },
                {
                    "id": "prod_01J832CXAZKYHEDSFKET0C8JWB",
                    "handle": "xiaomi-phone",
                    "title": "Xiaomi Smartphone",
                    "description": "Xiaomi Smartphone",
                    "thumbnail": "https://static.snapchum.com/SC013/main-plain.png"
                },
                {
                    "id": "prod_01J8319HHATQ2CWH70VQR2VG9T",
                    "handle": "mouse-rapoo-m10",
                    "title": "Rapoo M10 Wireless Mouse - High Precision, Ergonomic Design, Long Battery Life",
                    "description": "Rapoo M10 Wireless Mouse - High Precision, Ergonomic Design, Long Battery Life",
                    "thumbnail": "https://static.snapchum.com/SC003/main-plain-black.png"
                },
                {
                    "id": "prod_01J8326VDM2A8S8R8HGT7F1TCW",
                    "handle": "sd-card-camera",
                    "title": "Micro SD card for Cameras - Durability: Waterproof, temperature-proof - Full HD Video Support",
                    "description": "Micro SD card for Cameras - Durability: Waterproof, temperature-proof - Full HD Video Support",
                    "thumbnail": "https://static.snapchum.com/SC002/main-plain.png"
                },
                {
                    "id": "prod_01J7ZZRKEQSQW3HBRQQ1DMC5FS",
                    "handle": "glass-screen-protector",
                    "title": "Premium HD Tempered Glass Screen Protector for iPhone Pro",
                    "description": "Premium HD Tempered Glass Screen Protector for iPhone Pro",
                    "thumbnail": "https://static.snapchum.com/SC011/main-plain.png"
                },
                {
                    "id": "prod_01J9DWFCKGW2ZDZBARCCZD65ZM",
                    "handle": "universal-power-strip",
                    "title": "Universal power strip",
                    "description": "Universal power strip",
                    "thumbnail": "https://static.snapchum.com/SC010/main-plain.png"
                },
                {
                    "id": "prod_01J9DWM19VNE7Z8FH8VXP32GNS",
                    "handle": "multi-charging-cable",
                    "title": "Multi-Charging Cable for Phone - Fast Charging for iPhone & Android",
                    "description": "Multi-Charging Cable for Phone - Fast Charging for iPhone & Android",
                    "thumbnail": "https://static.snapchum.com/SC015/main-plain.png"
                },
            ])
        });
    */
};
