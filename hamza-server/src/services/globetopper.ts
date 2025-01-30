import {
    TransactionBaseService,
    ProductStatus,
    ProductVariant,
} from '@medusajs/medusa';
import ProductService, {
    CreateProductVariantInputDTO,
    UpdateProductInput,
    UpdateProductProductVariantDTO,
} from '../services/product';
import { Product } from '../models/product';
import { PriceConverter } from '../utils/price-conversion';
import {
    CreateProductProductVariantInput,
    CreateProductInput as MedusaCreateProductInput,
} from '@medusajs/medusa/dist/types/product';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import { createLogger, ILogger } from '../utils/logging/logger';
import { GlobetopperClient } from '../globetopper/globetopper-client';
import SmtpMailService from './smtp-mail';
import { ExternalApiLogRepository } from '../repositories/external-api-log';
import { LineItem } from '../models/line-item';

const PRODUCT_EXTERNAL_SOURCE: string = 'globetopper';

type CreateProductInput = MedusaCreateProductInput & {
    store_id: string;
    external_source: string;
    external_metadata?: Record<string, unknown>;
};

export default class GlobetopperService extends TransactionBaseService {
    protected readonly logger: ILogger;
    protected readonly productService_: ProductService;
    protected readonly smtpMailService_: SmtpMailService;
    protected readonly priceConverter: PriceConverter;
    protected readonly apiClient: GlobetopperClient;
    protected readonly externalApiLogRepository_: typeof ExternalApiLogRepository;
    public static readonly EXTERNAL_SOURCE: string = PRODUCT_EXTERNAL_SOURCE;

    constructor(container) {
        super(container);
        this.productService_ = container.productService;
        this.smtpMailService_ = container.smtpMailService;
        this.externalApiLogRepository_ = container.externalApiLogRepository;
        this.logger = createLogger(container, 'GlobetopperService');
        this.priceConverter = new PriceConverter(
            this.logger,
            container.cachedExchangeRateRepository
        );
        this.apiClient = new GlobetopperClient(
            this.logger,
            this.externalApiLogRepository_
        );
    }

    public async import(
        storeId: string,
        behavior: string,
        categoryId: string,
        collectionId: string,
        salesChannelId: string,
        currencyCode: string = 'USD'
    ): Promise<Product[]> {
        try {
            //get products in two API calls
            const gtProducts = await this.apiClient.searchProducts(
                undefined,
                currencyCode
            );
            const gtCatalogue = await this.apiClient.getCatalog();

            const toCreate: (CreateProductInput & { store_id: string })[] = [];
            const toUpdate: UpdateProductInput[] = [];
            const newVariantsList: CreateProductVariantInputDTO[] = [];
            const deletedVariantIdsList: string[] = [];

            //sort the output
            const gtRecords = gtProducts.records.sort(
                (a, b) => (a?.operator?.id ?? 0) < (b?.operator?.id ?? 0)
            );

            const gtCat = gtCatalogue.records.sort(
                (a, b) =>
                    (a?.topup_product_id ?? 0) < (b?.topup_product_id ?? 0)
            );

            //create product inputs for each product
            for (let record of gtRecords) {
                const productDetails = gtCat.find(
                    (r) => r.topup_product_id == (record?.operator?.id ?? 0)
                );

                //determine whether or not the gift card currently exists in our database
                const existingProduct =
                    await this.productService_.getProductByExternalSourceAndExternalId(
                        record?.operator?.id,
                        PRODUCT_EXTERNAL_SOURCE
                    );

                if (productDetails) {
                    if (!existingProduct) {
                        if (
                            behavior === 'add-only' ||
                            behavior === 'combined'
                        ) {
                            const item = await this.mapDataToInsertProductInput(
                                record,
                                productDetails,
                                ProductStatus.PUBLISHED,
                                storeId,
                                categoryId,
                                collectionId,
                                [salesChannelId]
                            );

                            if (item?.handle) toCreate.push(item);
                        }
                    } else {
                        if (
                            behavior === 'update-only' ||
                            behavior === 'combined'
                        ) {
                            const {
                                updateInput,
                                newVariants,
                                deletedVariantIds,
                            } = await this.mapDataToUpdateProductInput(
                                record,
                                productDetails,
                                ProductStatus.PUBLISHED,
                                storeId,
                                categoryId,
                                collectionId,
                                [salesChannelId],
                                existingProduct
                            );

                            if (updateInput?.handle) toUpdate.push(updateInput);
                            if (newVariants.length)
                                newVariantsList.push(...newVariants);
                            if (deletedVariantIds.length)
                                deletedVariantIdsList.push(
                                    ...deletedVariantIds
                                );
                        }
                    }
                }

                /* //TODO:
                 now, based on behavior param, we decide how to handle existing 

                 if (behavior is add-only, and existing = true, then ignore)
                 if (behavior is update-only, and existing = false, then ignore )
                 if existing, then update
                 if not existing, then add 
                */

                /*
                Fields that can be updated: 
                    product.title
                    product.subtitle 
                    description
                    thumbnail
                    images
                    external_metadata
                    variants/prices
                 */
            }

            this.logger.debug(`importing ${toCreate.length} products`);

            let createdProducts: Product[] = [];
            let updatedProducts: Product[] = [];

            if (toCreate.length) {
                createdProducts = await this.productService_.bulkImportProducts(
                    storeId,
                    toCreate
                );
            }

            if (toUpdate.length) {
                updatedProducts = await this.productService_.bulkUpdateProducts(
                    storeId,
                    toUpdate,
                    newVariantsList,
                    deletedVariantIdsList
                );
            }

            return [...createdProducts, ...updatedProducts];
        } catch (e: any) {
            this.logger.error('Error importing GlobeTopper products', e);
        }

        return [];
    }

    public async processPointOfSale(
        orderId: string,
        firstName: string,
        lastName: string,
        email: string,
        items: LineItem[]
    ): Promise<any[]> {
        const promises: Promise<any>[] = [];

        this.logger.info(
            `Processing gift cards point of sale for ${orderId} with items ${items?.length}`
        );

        //make a list of promises
        for (let n = 0; n < items.length; n++) {
            const quantity = items[n].quantity ?? 1;
            const variant = items[n].variant;
            const gtOrderId = items[n].external_order_id;

            //account for quantity of each
            for (let i = 0; i < quantity; i++) {
                /*
                There is a decision to be made here: if there are 3 $5 XYZ cards, 
                should we make it just 1 $15 one? I'm going to go with a no for now, 
                but we can come back to this. 
                (If they truly are gifts, buyer might intend 3 different ones for 3 different people)

                We could get more granular but then we'd specialize in gift cards. Maybe better to see 
                how well they sell first
                */
                promises.push(
                    this.purchaseItem(
                        gtOrderId,
                        firstName,
                        lastName,
                        email,
                        variant
                    )
                );
            }
        }

        //here you have an array of outputs, 1 for each variant
        const purchaseOutputs = promises.length
            ? await Promise.all(promises)
            : [];

        // send email(s)
        // handle balance - notify site admin if balance is below threshold
        // update order

        /*
        EXAMPLE OF data.records[n]: 
        ---------------------------
        record 0:  {
            trans_id: 13421585,
            extra_fields: {
                'Redemption URL': 'https://spend.playground.runa.io/4fc4edf7-c78e-4e68-b415-bcfc5b0bea17',
                'Expiration Date': '2025-03-10'
            },
            meta_fields: [
                { attribute: [Object], content: '3.00' },
                { attribute: [Object], content: 'Todd-Royal' },
                { attribute: [Object], content: 'Barsoooom' },
                {
                attribute: [Object],
                content: '0x1542612fee591ed35c05a3e980bab325265c06a3@evm.blockchain'
                },
                { attribute: [Object], content: '1' },
                { attribute: [Object], content: '123456' },
                { attribute: [Object], content: null },
                { attribute: [Object], content: null }
            ],
            operator_transid: null,
            operator_card_serial: null,
            operator_card_num: null,
            operator_card_notes: null,
            source: 'API',
            remote_ip: '10.42.216.0',
            msisdn: '123456',
            operator: {
                id: 824,
                name: 'Google Play UK',
                sku: null,
                phone: '1xxxxxxxxxx',
                metadata: [],
                country: {
                iso2: 'GB',
                iso3: 'GBR',
                name: 'United Kingdom',
                dial_code: '+44-xxx-xxx-xxxx',
                currency: [Object]
                }
            },
            value: {
                BillerID: 14973,
                name: 'Google Play UK',
                description: null,
                notes: null,
                currency: { code: 'GBP', name: 'Pound Sterling' },
                display: '3.00 - 500.00 by 0.10',
                operator: {
                id: 824,
                name: 'Google Play UK',
                sku: null,
                phone: '1xxxxxxxxxx',
                metadata: [],
                country: [Object]
                },
                min: '3.00',
                max: '500.00',
                increment: '0.10',
                is_a_range: true,
                locval: 3.8305800000000003,
                type: { id: 2, name: 'Pin' },
                category: { id: 6, name: 'Gift Card', description: 'Digital Gift Cards' },
                discount: '5.00000',
                fees: [],
                request_attributes: [
                [Object], [Object],
                [Object], [Object],
                [Object], [Object],
                [Object], [Object]
                ],
                additional_details: [],
                user_display: '3.00 - 500.00 by 0.10',
                delivered_value: ''
            },
            recharge_amount: 3,
            owner_recharge_amount: '3.00',
            owner_currency: { code: 'USD', name: 'US Dollar' },
            exchange_rate: '1.2768600000',
            final_amount: 3.8305859519644523,
            final_tax: 0,
            promo_discount: 0,
            create_date: '2024-12-10 10:21:12',
            settle_date: '2024-12-10 10:21:14',
            status: 0,
            status_description: 'Success',
            payment: { id: 8, abbreviation: 'CASH', name: 'Cash' },
            country: {
                iso2: 'GB',
                iso3: 'GBR',
                name: 'United Kingdom',
                dial_code: '+44-xxx-xxx-xxxx',
                currency: { code: 'GBP', name: 'Pound Sterling' }
            },
            currency: { code: 'GBP', name: 'Pound Sterling' },
            user_id: 22803,
            commissions: [
                {
                agent_id: 22803,
                credit: '0.19153',
                debit: '0.00000',
                date: '2024-12-10 10:21:14',
                type: 'COMMISSION',
                related_id: '13421585',
                description: 'Pay Commission',
                new_balance: '1401.08875',
                owner_credit: '0.19153',
                owner_debit: '0.00000',
                owner_new_balance: '1,401.08875',
                owner_currency: [Object]
                }
            ],
            ownerFees: [],
            summary: {
                TotalFaceValue: 3,
                TotalSurcharges: 0,
                TotalFees: 0,
                TotalDiscounts: 0.19,
                TotalCustomerCostUSD: 3.64
            }
            }

        */

        // stub to build email content
        if (purchaseOutputs?.length)
            await this.sendPostPurchaseEmail(purchaseOutputs, email);

        //TODO: what to do with the outputs now?
        return purchaseOutputs ?? [];
    }

    private async purchaseItem(
        orderId: number,
        firstName: string,
        lastName: string,
        email: string,
        variant: ProductVariant
    ): Promise<any> {
        const output = await this.apiClient.purchase({
            productID: variant.product.external_id,
            amount: variant.external_metadata?.amount?.toString(),
            first_name: firstName,
            last_name: lastName,
            email,
            order_id: orderId,
        });

        if (variant?.metadata?.imgUrl) {
            output.data.thumbnail = variant.metadata.imgUrl;
        }
        return output.data;
    }

    private async sendPostPurchaseEmail(purchases: any, email: string) {
        let emailBody: string = '';

        for (const purchase of purchases) {
            const cardInfo: string[] = [];
            const record: any = purchase.records[0];

            for (const field in record.extra_fields) {
                let extraFieldContent: string = '';
                const fieldValue: string = record.extra_fields[field];

                switch (field) {
                    case 'Barcode Image URL':
                    case 'Brand Logo':
                        extraFieldContent = `<img src="${fieldValue}" />`;
                        break;
                    case 'Redemption URL':
                    case 'Barcode URL':
                    case 'Admin Barcode URL':
                        extraFieldContent = `<a href="${fieldValue}">`;
                        extraFieldContent += fieldValue;
                        extraFieldContent += '</a>';
                        break;
                    default:
                        extraFieldContent = fieldValue;
                }

                extraFieldContent = `${field}: ${extraFieldContent}`;
                cardInfo.push(extraFieldContent);
            }

            //get thumbnail image to display, if there is one
            let thumbnailImgHtml = '';
            if (purchase.thumbnail) {
                thumbnailImgHtml = `
                            <div style="margin-bottom: 1rem;">
                                <img class="item-image" 
                                src="${purchase.thumbnail}"
                                alt="gift card thumbnail"
                                />
                            </div>
                            `;
            }

            //combine all into email body
            emailBody += `${thumbnailImgHtml}<b>${purchase.records[0]?.operator?.name}</b><br/>${cardInfo.join('<br /><br />\n')}`;
            console.log(
                `Globetopper gift card email info for customer ${email}:\n${emailBody}`
            );
        }

        await this.smtpMailService_.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Gift Card Purchase from Hamza',
            templateName: 'gift-card-purchase',
            mailData: {
                body: emailBody,
            },
        });
    }

    private async mapDataToInsertProductInput(
        item: any,
        productDetail: any,
        status: ProductStatus,
        storeId: string,
        categoryId: string,
        collectionId: string,
        salesChannels: string[]
    ): Promise<CreateProductInput> {
        try {
            /*
        {
            "name": "Airbnb AU",
            "description": null,
            "notes": null,
            "display": [
                "100.00"
            ],
            "user_display": "100.00",
            "operator": {
                "id": 3046,
                "name": "Airbnb AU",
                "sku": null,
                "phone": "1xxxxxxxxxx",
                "metadata": [],
                "country": {
                "iso2": "AU",
                "iso3": "AUS",
                "name": "Australia",
                "dial_code": "+61-x-xxxx-xxxx",
                "currency": {
                    "code": "AUD",
                    "name": "Australian Dollar"
                }
                }
            },
            "min": "100.00",
            "max": "100.00",
            "increment": "0.00",
            "is_a_range": false,
            "locval": [67.39],
            "type": {
                "id": 2,
                "name": "Pin"
            },
            "category": {
                "id": 6,
                "name": "Gift Card",
                "description": "Digital Gift Cards"
            },
            "discount": [
                {
                "id": 22983,
                "display": "100.00",
                "discount": 0
                },
                {
                "id": "*",
                "display": "*",
                "discount": "1.95000"
                }
            ],
            "fees": [],
            "request_attributes": [
                {
                "name": "amount",
                "label": "Amount",
                "description": null,
                "required": true
                },
                {
                "name": "email",
                "label": "Email Address",
                "description": null,
                "required": true
                },
                {
                "name": "first_name",
                "label": "First Name",
                "description": null,
                "required": true
                },
                {
                "name": "last_name",
                "label": "Last Name",
                "description": null,
                "required": true
                },
                {
                "name": "notif_email",
                "label": "Notification Email",
                "description": "The email address to which a notification should be sent.",
                "required": false
                },
                {
                "name": "notif_tele",
                "label": "Notification SMS",
                "description": "The telephone number to which a notification should be sent.",
                "required": false
                },
                {
                "name": "order_id",
                "label": "Order ID",
                "description": null,
                "required": true
                },
                {
                "name": "quantity",
                "label": "Quantity",
                "description": null,
                "required": true
                }
            ],
            "additional_details": [
                {
                "id": 22983,
                "value": "100.00",
                "meta_data": []
                }
            ],
            "delivered_value": "100.000"
        };
      
      
      CATALOG: 
      {
        "id": 21,
        "topup_product_id": 1426,
        "status": "Published",
        "brand": "Amazon UAE",
        "reward_format": "Code",
        "reward_example": null,
        "card_image": "https://crm.globetopper.com/brandImages/60ede95dd5a4f.jpg",
        "usage": "Online",
        "expiration": "10 years from the date of issue",
        "brand_description": "Amazon Gift Card is the perfect way to give your loved ones exactly what they're hoping for, even if you don't know what it is. Recipients can choose from millions of items storewide. Amazon Gift Card stored value never expires, so they can buy something immediately or wait for that sale of a lifetime.\n\nAmazon Gift Card United Arab Emirates can ONLY be used on www.amazon.ae",
        "redemption_instruction": "Login into your Amazon Account.\nClick \"Apply a Gift Card to Your Account\".\nEnter your claim code and click \"Apply to Your Account\".",
        "brand_disclaimer": null,
        "term_and_conditions": "https://www.amazon.ae/gp/help/customer/display.html?nodeId=201936990",
        "restriction_and_policies": null,
        "brand_additional_information": null,
        "dashboard_display": true,
        "currency": "Arab Emirates Dirham",
        "country": "United Arab Emirates",
        "iso2": "AE",
        "iso3": "ARE",
        "value_type": "Variable",
        "denomination": "50.00 - 1,000.00 by 0.00"
        }
      */

            const externalId = item?.operator?.id;

            if (!externalId) throw new Error('SPU code not found');
            const variants = await this.mapVariants(item, productDetail);

            const output: CreateProductInput = this.mapProductDataToInput(
                item,
                productDetail,
                status,
                variants,
                externalId,
                storeId,
                categoryId,
                collectionId,
                salesChannels,
                null
            ) as CreateProductInput;
            /*
            //add variant images to the main product images
            const images = []; //TODO: get images
            const description = this.buildDescription(productDetail);
            const handle = this.buildHandle(item, externalId);

            const output = {
                title: item?.name,
                subtitle: this.getSubtitle(productDetail),
                handle,
                description,
                is_giftcard: false,
                status: status as ProductStatus,
                thumbnail: item?.picUrl ?? productDetail?.card_image,
                images,
                collection_id: collectionId,
                weight: Math.round(item?.weight ?? 100),
                discountable: true,
                store_id: storeId,
                external_id: externalId,
                external_source: PRODUCT_EXTERNAL_SOURCE,
                external_metadata: productDetail,
                categories: categoryId?.length ? [{ id: categoryId }] : [],
                sales_channels: salesChannels.map((sc) => {
                    return { id: sc };
                }),
                options: [{ title: 'Amount' }],
                variants,
            };
            */

            if (!output.variants?.length)
                throw new Error(
                    `No variants were detected for product ${externalId}`
                );

            return output;
        } catch (error) {
            this.logger.error(
                'Error mapping Globetopper data to product input',
                error
            );
            return null;
        }
    }

    private async mapDataToUpdateProductInput(
        item: any,
        productDetail: any,
        status: ProductStatus,
        storeId: string,
        categoryId: string,
        collectionId: string,
        salesChannels: string[],
        existingProduct: Product
    ): Promise<{
        updateInput: UpdateProductInput;
        newVariants: CreateProductVariantInputDTO[];
        deletedVariantIds: string[];
    }> {
        try {
            const externalId = item?.operator?.id;

            if (!externalId) throw new Error('SPU code not found');

            const { updatedVariants, newVariants, deletedVariantIds } =
                await this.mapVariantsForUpdate(
                    item,
                    productDetail,
                    existingProduct
                );

            const updateInput: UpdateProductInput = this.mapProductDataToInput(
                item,
                productDetail,
                status,
                updatedVariants,
                externalId,
                storeId,
                categoryId,
                collectionId,
                salesChannels,
                existingProduct
            ) as UpdateProductInput;

            return { updateInput, newVariants, deletedVariantIds };
        } catch (error) {
            this.logger.error(
                'Error mapping Globetopper data to UpdateProductInput',
                error
            );
            return {
                updateInput: {} as UpdateProductInput,
                newVariants: [],
                deletedVariantIds: [],
            };
        }
    }

    private async mapVariants(
        item: any,
        productDetail: any
    ): Promise<CreateProductProductVariantInput[]> {
        const variants = [];
        const variantPrices = this.getVariantPrices(item);
        variantPrices.sort((a, b) => a - b);

        for (let index = 0; index < variantPrices.length; index++) {
            const variantPrice = variantPrices[index];
            variants.push({
                title: item?.name,
                inventory_quantity: 9999,
                allow_backorder: false,
                manage_inventory: true,
                external_id: item?.operator?.id,
                external_source: PRODUCT_EXTERNAL_SOURCE,
                external_metadata: { amount: variantPrice.toFixed(2) },
                metadata: { imgUrl: productDetail?.card_image },
                prices: await this.buildPriceForNewVariant(variantPrice),
                options: [{ value: `${variantPrice.toFixed(2)} USD` }],
                variant_rank: index,
            });
        }

        return variants;
    }

    private getVariantPrices(item: any): number[] {
        const targetPrices: number[] = [
            1, 3, 5, 10, 25, 50, 100, 250, 500, 1000, 1500, 2000, 2500,
        ];
        const output: number[] = [];

        const findClosest = (
            target: number,
            lastNumber: number,
            increment: number
        ) => {
            let current = lastNumber;
            if (increment === 0) increment = 0.01;

            for (let n = lastNumber; n <= target; n += increment) {
                current = n;
            }

            return target - current <= current + increment - target
                ? current
                : current + increment;
        };

        const min = parseFloat(item.min.replaceAll(',', ''));
        const max = parseFloat(item.max.replaceAll(',', ''));
        const increment = parseFloat(item.increment.replaceAll(',', ''));
        for (let n = 0; n < targetPrices.length; n++) {
            const price: number = targetPrices[n];
            if (price < min) {
                if (!output.find((i) => i === min)) {
                    output.push(min);
                }
            }

            const next: any = findClosest(
                price,
                output[output.length - 1],
                increment
            );
            if (!output.find((i) => i === next) && next <= max) {
                output.push(parseFloat(next.toFixed(2)));
            }

            if (price > max) {
                if (!output.find((i) => i === max)) output.push(max);
                break;
            }
        }

        return output;
    }

    private async mapVariantsForUpdate_firstversion(
        item: any,
        productDetail: any,
        existingProduct: Product
    ): Promise<UpdateProductProductVariantDTO[]> {
        const variantPrices = this.getVariantPrices(item);
        variantPrices.sort((a, b) => a - b);

        const minPrice: number = parseFloat(item.min);
        const maxPrice: number = parseFloat(item.max);

        const updatedVariants: UpdateProductProductVariantDTO[] = [];
        const existingVariants = existingProduct.variants || [];

        let variantRank = 0;
        for (const variantPrice of variantPrices) {
            const isWithinRange =
                variantPrice >= minPrice && variantPrice <= maxPrice;
            if (!isWithinRange) {
                const variantToDelete = existingVariants.find(
                    (ev) =>
                        ev.external_metadata?.amount === variantPrice.toFixed(2)
                );
                if (variantToDelete) {
                    this.logger.info(
                        `Variant with price ${variantPrice} does not meet allowed rules; variant ${variantToDelete.id} will be deleted.`
                    );
                }
                continue;
            }

            const existingVariant = existingVariants.find(
                (ev) => ev.external_metadata?.amount === variantPrice.toFixed(2)
            );

            const updatedVariant: UpdateProductProductVariantDTO = {
                id: existingVariant?.id,
                title: item?.name,
                inventory_quantity: existingVariant?.inventory_quantity ?? 9999,
                allow_backorder: false,
                manage_inventory: true,
                // product_id: existingProduct.id,
                // external_id: item?.operator?.id,
                // external_source: PRODUCT_EXTERNAL_SOURCE,
                // external_metadata: { amount: variantPrice.toFixed(2) },
                metadata: {
                    ...existingVariant?.metadata,
                    imgUrl: productDetail?.card_image,
                },
                prices: [
                    {
                        currency_code: 'usdc',
                        amount: Math.floor(variantPrice * 100),
                    },
                    {
                        currency_code: 'usdt',
                        amount: Math.floor(variantPrice * 100),
                    },
                    {
                        currency_code: 'eth',
                        amount: await this.priceConverter.getPrice({
                            baseAmount: Math.floor(variantPrice * 100),
                            baseCurrency: 'usdc',
                            toCurrency: 'eth',
                        }),
                    },
                ],
                options: [
                    {
                        value: variantPrice.toFixed(2),
                        option_id:
                            existingProduct?.options?.[0]?.id ?? 'option_id',
                    },
                ],
            };

            updatedVariants.push(updatedVariant);
            variantRank++;
        }
        return updatedVariants;
    }

    private async mapVariantsForUpdate(
        item: any,
        productDetail: any,
        existingProduct: Product
    ): Promise<{
        updatedVariants: UpdateProductProductVariantDTO[];
        newVariants: CreateProductVariantInputDTO[];
        deletedVariantIds: string[];
    }> {
        // Get the list of new prices from globetopper
        const variantPrices = this.getVariantPrices(item);
        variantPrices.sort((a, b) => a - b);

        // Gather existing variants
        const existingVariants = existingProduct.variants || [];

        // Build map for existing variants using price string:
        const oldMap = new Map<string, ProductVariant>();
        for (const oldVar of existingVariants) {
            const oldPriceString = oldVar.external_metadata?.amount;
            if (oldPriceString) {
                oldMap.set(`${oldPriceString}-${oldVar.id}`, oldVar);
            }
        }

        // Create arrays to return
        const updatedVariants: UpdateProductProductVariantDTO[] = [];
        const newVariants: CreateProductVariantInputDTO[] = [];
        const deletedVariantIds: string[] = [];

        const unmatchedNewPrices: number[] = [];
        const unmatchedOldVariants: ProductVariant[] = [];

        // old price == new price
        for (const newPrice of variantPrices) {
            const priceKey = newPrice.toFixed(2);

            const matchingKeys = [...oldMap.keys()].filter((key) =>
                key.startsWith(priceKey)
            );

            if (matchingKeys.length > 0) {
                const firstMatchKey = matchingKeys.shift();
                const oldVariant = oldMap.get(firstMatchKey!);

                // Update that old variant
                const updatedVar: UpdateProductProductVariantDTO =
                    await this.buildUpdatedVariant(
                        item,
                        oldVariant,
                        newPrice,
                        productDetail
                    );

                updatedVariants.push(updatedVar);

                // Remove from the map
                oldMap.delete(firstMatchKey);
            } else {
                unmatchedNewPrices.push(newPrice);
            }
        }

        unmatchedOldVariants.push(...oldMap.values());

        //  Repurpose old variants
        const repurposeCount = Math.min(
            unmatchedOldVariants.length,
            unmatchedNewPrices.length
        );

        for (let i = 0; i < repurposeCount; i++) {
            const oldVar = unmatchedOldVariants[i];
            const newPrice = unmatchedNewPrices[i];

            const repurposed: UpdateProductProductVariantDTO =
                await this.buildUpdatedVariant(
                    item,
                    oldVar,
                    newPrice,
                    productDetail
                );

            updatedVariants.push(repurposed);
        }

        // After repurposing, remove them from the leftover arrays
        unmatchedOldVariants.splice(0, repurposeCount);
        unmatchedNewPrices.splice(0, repurposeCount);

        //  Add new variants for leftover new
        for (const leftoverPrice of unmatchedNewPrices) {
            const newVar: CreateProductVariantInputDTO =
                await this.buildNewVariant(
                    leftoverPrice,
                    item,
                    productDetail,
                    existingProduct
                );
            newVariants.push(newVar);
        }

        // Delete leftover old variants
        // Soft-delete all unmatched old variants
        for (const leftoverOld of unmatchedOldVariants) {
            deletedVariantIds.push(leftoverOld.id);
        }
        return {
            updatedVariants,
            newVariants,
            deletedVariantIds,
        };
    }

    private async buildUpdatedVariant(
        item: any,
        oldVariant: ProductVariant,
        newPrice: number,
        productDetail: any
    ): Promise<UpdateProductProductVariantDTO> {
        const updatedPrices = await this.buildPriceForUpdateVariant(
            oldVariant.prices,
            newPrice
        );

        const updatedOptions = this.buildOptionForVariant(
            oldVariant.options,
            newPrice
        );

        const updatedVariant: UpdateProductProductVariantDTO = {
            id: oldVariant.id,
            title: item?.name,
            inventory_quantity: oldVariant.inventory_quantity ?? 9999,
            allow_backorder: false,
            manage_inventory: true,
            metadata: {
                imgUrl: productDetail?.card_image,
            },
            prices: updatedPrices,
            options: updatedOptions,

            external_id: item?.operator?.id,
            external_source: PRODUCT_EXTERNAL_SOURCE,
            external_metadata: { amount: newPrice.toFixed(2) },
            variant_rank: oldVariant.variant_rank ?? 0,
        };

        return updatedVariant;
    }

    private async buildNewVariant(
        newPrice: number,
        item: any,
        productDetail: any,
        existingProduct: Product
    ): Promise<CreateProductVariantInputDTO> {
        return {
            product_id: existingProduct.id,
            title: item?.name,
            inventory_quantity: 9999,
            allow_backorder: false,
            manage_inventory: true,
            external_id: item?.operator?.id,
            external_source: PRODUCT_EXTERNAL_SOURCE,
            external_metadata: { amount: newPrice.toFixed(2) },
            metadata: {
                imgUrl: productDetail?.card_image,
            },
            prices: await this.buildPriceForNewVariant(newPrice),
            options: [
                {
                    option_id: existingProduct?.options?.[0]?.id ?? 'option_id',
                    value: `${newPrice.toFixed(2)} USD`,
                },
            ],
            variant_rank: this.calculateVariantRank(
                existingProduct.variants || []
            ),
        };
    }

    private calculateVariantRank(existingVariants: ProductVariant[]): number {
        // Extract & sort existing ranks
        const usedRanks = existingVariants
            .map((v) => v.variant_rank)
            .sort((a, b) => a - b);

        // Find the first missing rank (fill gaps)
        for (let i = 0; i < usedRanks.length; i++) {
            if (usedRanks[i] !== i) {
                return i; 
            }
        }

        return usedRanks.length; 
    }

    private async buildPriceForUpdateVariant(
        oldPrices: any[],
        newPrice: number
    ): Promise<any[]> {
        const baseAmount = Math.floor(newPrice * 100);

        // Fetch the ETH amount
        const ethAmount = await this.priceConverter.getPrice({
            baseAmount: baseAmount,
            baseCurrency: 'usdc',
            toCurrency: 'eth',
        });

        // Create a map for updated amounts by currency code
        const updatedAmounts: { [key: string]: number } = {
            usdc: baseAmount,
            usdt: baseAmount,
            eth: ethAmount,
        };

        // Update existing prices
        const updatedPrices = oldPrices.map((price) => {
            if (updatedAmounts.hasOwnProperty(price.currency_code)) {
                return {
                    ...price,
                    amount: updatedAmounts[price.currency_code].toString(),
                    updated_at: new Date().toISOString(),
                };
            }
            return price;
        });

        return updatedPrices;
    }

    private async buildPriceForNewVariant(newPrice: number): Promise<any[]> {
        const baseAmount = Math.floor(newPrice * 100);

        return [
            {
                currency_code: 'usdc',
                amount: baseAmount,
            },
            {
                currency_code: 'usdt',
                amount: baseAmount,
            },
            {
                currency_code: 'eth',
                amount: await this.priceConverter.getPrice({
                    baseAmount: baseAmount,
                    baseCurrency: 'usdc',
                    toCurrency: 'eth',
                }),
            },
        ];
    }

    private buildOptionForVariant(oldOptions: any[], newPrice: number): any[] {
        return oldOptions.map(({ created_at, updated_at, ...rest }) => ({
            ...rest,
            value: `${newPrice.toFixed(2)} USD`,
        }));
    }

    private buildDescription(productDetail: any): string {
        const formatSection = (title: string, content: string): string => {
            if (content && content.trim() !== '') {
                return `<b>${title}</b><br/><p>${content}</p><br/>`;
            }
            return '';
        };

        let description = '';
        description += formatSection(
            'Brand Description: ',
            productDetail.brand_description
        );
        description += formatSection(
            'Redemption Instructions: ',
            productDetail.redemption_instruction
        );
        description += formatSection(
            'Disclaimer: ',
            productDetail.brand_disclaimer
        );
        description += formatSection(
            'Terms & Conditions: ',
            productDetail.term_and_conditions
        );
        description += formatSection(
            'Restriction & Policies: ',
            productDetail.restriction_and_policies
        );
        description += formatSection(
            'Additional Information: ',
            productDetail.brand_additional_information
        );

        return description;
    }

    private buildHandle(item: any, externalId: string): string {
        let handle = item?.name
            ?.trim()
            ?.toLowerCase()
            ?.replace(/[^a-zA-Z0-9 ]/g, '')
            ?.replaceAll(' ', '-');
        handle = `gc-${handle}-${externalId}`;
        return handle;
    }

    private getSubtitle(productDetail: any): string {
        return productDetail.brand_description;
    }

    private buildOptions(existingProduct: Product): Partial<any>[] {
        if (!existingProduct.options) return [];

        return existingProduct.options.map((opt) => ({
            id: opt.id,
            title: opt.title,
            product_id: opt.product_id,
            metadata: opt.metadata,
        }));
    }

    private mapProductDataToInput(
        item: any,
        productDetail: any,
        status: ProductStatus,
        variants: any,
        externalId: string,
        storeId: string,
        categoryId: string,
        collectionId: string,
        salesChannels: string[],
        existingProduct: Product
    ): UpdateProductInput | CreateProductInput {
        const images = []; //TODO: get images
        const description = this.buildDescription(productDetail);
        const handle = this.buildHandle(item, externalId);

        const output: any = {
            id: existingProduct?.id,
            title: item?.name,
            subtitle: this.getSubtitle(productDetail),
            handle,
            description,
            is_giftcard: false,
            status: status as ProductStatus,
            thumbnail: item?.picUrl ?? productDetail?.card_image,
            images,
            collection_id: collectionId,
            weight: Math.round(item?.weight ?? 100),
            discountable: true,
            store_id: storeId,
            external_id: externalId,
            external_source: PRODUCT_EXTERNAL_SOURCE,
            external_metadata: productDetail,
            categories: categoryId?.length ? [{ id: categoryId }] : [],
            sales_channels: salesChannels.map((sc) => {
                return { id: sc };
            }),
            options: [{ title: 'Amount' }],
        };

        if (variants) output.variants = variants;

        if (existingProduct) {
            output.options = this.buildOptions(existingProduct);
        }

        return output;
    }
}
