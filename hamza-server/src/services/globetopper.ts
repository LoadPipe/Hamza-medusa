import {
    TransactionBaseService,
    ProductStatus,
    CartService,
    Cart,
    OrderStatus,
    FulfillmentStatus,
    CustomerService,
    PaymentStatus,
} from '@medusajs/medusa';
import ProductService from '../services/product';
import OrderService from '../services/order';
import { BuckyLogRepository } from '../repositories/bucky-log';
import { Product } from '../models/product';
import { Order } from '../models/order';
import { PriceConverter } from '../utils/price-conversion';
import {
    BuckyClient,
    IBuckyShippingCostRequest,
    ICreateBuckyOrderProduct,
} from '../buckydrop/bucky-client';
import {
    CreateProductProductVariantInput,
    CreateProductInput as MedusaCreateProductInput,
    ProductOptionInput,
} from '@medusajs/medusa/dist/types/product';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import { createLogger, ILogger } from '../utils/logging/logger';
import {
    IsNull,
    Not,
    FindManyOptions,
    FindOptionsWhere as TypeormFindOptionsWhere,
    In,
} from 'typeorm';

type CreateProductInput = MedusaCreateProductInput & {
    store_id: string;
    bucky_metadata?: Record<string, unknown>;
};

type FindOptionsWhere<Order> = TypeormFindOptionsWhere<Order> & {
    bucky_metadata?: any;
};

const SHIPPING_COST_MIN: number = parseInt(
    process.env.BUCKY_MIN_SHIPPING_COST_US_CENT ?? '1000'
);
const SHIPPING_COST_MAX: number = parseInt(
    process.env.BUCKY_MAX_SHIPPING_COST_US_CENT ?? '4000'
);

// TODO: I think this code needs comments its difficult to understand.

export default class GlobetopperService extends TransactionBaseService {
    protected readonly logger: ILogger;
    protected readonly productService_: ProductService;
    protected readonly orderService_: OrderService;
    protected readonly orderRepository_: typeof OrderRepository;
    protected readonly priceConverter: PriceConverter;

    constructor(container) {
        super(container);
        this.productService_ = container.productService;
        this.orderRepository_ = container.orderRepository;
        this.orderService_ = container.orderService;
        this.logger = createLogger(container, 'GlobetopperService');
        this.priceConverter = new PriceConverter(
            this.logger,
            container.cachedExchangeRateRepository
        );
    }

    public async mapBuckyDataToProductInput(
        item: any,
        productDetails: any,
        status: ProductStatus,
        storeId: string,
        categoryId: string,
        collectionId: string,
        salesChannels: string[]
    ): Promise<CreateProductInput> {
        try {
            /*
            };*/

            const metadata = item;
            metadata.detail = productDetails.data;
            const spuCode = item?.spuCode ?? productDetails?.data?.spuCode;

            if (!spuCode?.length) throw new Error('SPU code not found');

            const optionNames =
                this.getUniqueProductOptionNames(productDetails);
            const tagName = productDetails.data.goodsCatName;
            const variants = await this.mapVariants(
                productDetails,
                optionNames
            );

            //add variant images to the main product images
            const images = productDetails?.data?.mainItemImgs ?? [];
            for (const v of variants) {
                if (
                    v.metadata?.imgUrl &&
                    !images.find((i) => i === v.metadata.imgUrl)
                )
                    images.push(v.metadata.imgUrl);
            }

            const output = {
                title: item?.goodsName ?? productDetails?.data?.goodsName,
                subtitle: item?.goodsName ?? productDetails?.data?.goodsName, //TODO: find a better value
                handle: spuCode,
                description: productDetails?.data?.goodsDetailHtml ?? '',
                is_giftcard: false,
                status: status as ProductStatus,
                thumbnail:
                    item?.picUrl ?? productDetails?.data?.mainItemImgs[0],
                images,
                collection_id: collectionId,
                weight: Math.round(item?.weight ?? 100),
                discountable: true,
                store_id: storeId,
                categories: categoryId?.length ? [{ id: categoryId }] : [],
                sales_channels: salesChannels.map((sc) => {
                    return { id: sc };
                }),
                tags: tagName?.length ? [{ id: tagName, value: tagName }] : [],
                bucky_metadata: metadata,
                options: optionNames.map((o) => {
                    return { title: o };
                }),
                variants,
            };

            if (!output.variants?.length)
                throw new Error(
                    `No variants were detected for product ${spuCode}`
                );

            return output;
        } catch (error) {
            this.logger.error(
                'Error mapping Bucky data to product input',
                error
            );
            return null;
        }
    }

    private async mapVariants(
        productDetails: any,
        optionNames: string[]
    ): Promise<CreateProductProductVariantInput[]> {
        const variants = [];

        const getVariantDescriptionText = (data: any) => {
            let output: string = '';
            if (data.props) {
                for (let prop of data.props) {
                    output += prop.valueName + ' ';
                }
                output = output.trim();
            } else {
                output = productDetails.data.goodsName;
            }
            return output;
        };

        if (!productDetails.data.skuList?.length) {
            this.logger.warn('EMPTY SKU LIST');
        }

        for (const variant of productDetails.data.skuList) {
            //get price
            const baseAmount = variant.proPrice
                ? variant.proPrice.priceCent
                : variant.price.priceCent;

            //TODO: get from someplace global
            const currencies = ['eth', 'usdc', 'usdt'];
            const prices = [];
            for (const currency of currencies) {
                prices.push({
                    currency_code: currency,
                    amount: await this.priceConverter.getPrice({
                        baseAmount,
                        baseCurrency: 'cny',
                        toCurrency: currency,
                    }),
                });
            }

            //get option names/values
            const options = [];
            if (variant.props) {
                for (const opt of optionNames) {
                    options.push({
                        value:
                            variant.props.find((o) => o.propName === opt)
                                ?.valueName ?? '',
                    });
                }
            }

            variants.push({
                title: getVariantDescriptionText(variant),
                inventory_quantity: variant.quantity,
                allow_backorder: false,
                manage_inventory: true,
                bucky_metadata: variant,
                metadata: { imgUrl: variant.imgUrl },
                prices,
                options: options,
            });
        }

        return variants;
    }

    private getUniqueProductOptionNames(productDetails: any): string[] {
        const output: string[] = [];

        for (const variant of productDetails.data.skuList) {
            for (const prop of variant.props) {
                if (!output.find((p) => p === prop.propName)) {
                    output.push(prop.propName);
                }
            }
        }

        return output;
    }
}
