'use client';

import { Region } from '@medusajs/medusa';
import React, { useEffect, useState } from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { notFound } from 'next/navigation';
import { Flex, Divider, Text } from '@chakra-ui/react';
import PreviewGallery from '../components/product-preview/components/image-gallery/image-display/preview-gallery';
import ProductInfo from '../components/product-preview/components/product-info/product-info';
import PreviewCheckout from '../components/product-preview/components/summary/preview-checkout';
import ProductReview from '../components/product-preview/components/product-review';
import useProductPreview from '@/zustand/product-preview/product-preview';
import StoreBanner from '../components/product-preview/components/store-banner/store-banner';
import { getPricedProductByHandle, getStore } from '@/lib/server';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@medusajs/icons';
import { ProductSchema, Product } from '@/lib/schemas/product';
import { formatCryptoPrice } from '@/lib/util/get-product-price';

type ProductTemplateProps = {
    // product: PricedProduct;
    region: Region;
    handle: string;
    countryCode: string;
};

/*
 * @Doom: This code needs to be ripped apart and put back together...
 * @Breakdown: let's break it down into component view. Get a nice herirachical overview of the components and how they interact with each other. This way we know what we are working with.
 * @useEffect: Currently the best way to deal with the zustand store, is to leave it as is. Let's not touch it for now.
 * @Pipeline: We want to control the data from root (product/[handle]/page.tsx) all the way down the leaf nodes. This way we can cache the data and control the flow of data.
 */

const ProductTemplate: React.FC<ProductTemplateProps> = ({
    region,
    handle,
    countryCode,
}) => {
    const {
        setProductData,
        setCountryCode,
        setRegionId,
        setProductId,
        setQuantity,
    } = useProductPreview();

    const [selectedVariantImage, setSelectedVariantImage] = useState('');

    const {
        data: product,
        isError,
        isLoading,
    } = useQuery<Product, Error>({
        queryKey: ['product', handle],
        queryFn: async () => {
            const response = await getPricedProductByHandle(handle, region);
            if (!response) {
                // If no product is found, throw an error
                throw new Error('Product not found');
            }
            // Parse the response using Zod to ensure it matches the Product schema
            return ProductSchema.parse(response);
        },
    });

    // If we hit these error states, product either doesn't exist or there was an error fetching it.
    // Otherwise, the rest of the page will render. [OMIT**Banner**]
    if (isError || !product || !product.id) {
        notFound();
    }

    // Only update product data when `product` changes
    // useProductPreview is a custom hook that sets the product data in a global zustand state.
    useEffect(() => {
        if (product && product.id) {
            setProductData(product);
            setProductId(product.id);
            setRegionId(region.id);
            setCountryCode(countryCode);
            setQuantity(1);
        } else {
            notFound();
        }
    }, [
        product,
        region,
        countryCode,
        setProductData,
        setProductId,
        setCountryCode,
        setRegionId,
        setQuantity,
    ]);

    // TODO: This CAN'T be grabbed in relations unless we get rid of getPricedProductByHandle and use a full custom hook removing medusaClient... not really beneficial
    // Fetching store data, based off the product id, storeData.(handle|icon) is used in StoreBanner (navigation/icon)
    // This is a separate query from the product query, as it fetches store data based off the product id.
    // We're using isStoreLoading && isStoreError states to handle loading and error states for Banner.
    const {
        data: storeData,
        isLoading: isStoreLoading,
        isError: isStoreError,
    } = useQuery({
        // Cache / Fetch data based off this unique product_id
        queryKey: ['store_vendor', product?.id],
        queryFn: () => getStore(product?.id as string),
        // Only run this query when product
        enabled: !!product.id,
    });

    /**
     * Generates JSON-LD structured data for product pages
     * Supports multiple cryptocurrencies (ETH, USDT, USDC)
     * TypeScript-safe with comprehensive error handling
     * @returns {Object|null} Schema.org Product structured data
     */
    const generateProductJsonLd = () => {
        if (!product) return null;

        /**
         * Helper function to strip HTML tags from description
         */
        const stripHtmlTags = (html: string) => {
            return html.replace(/<[^>]*>/g, '').trim();
        };

        /**
         * Determine product availability based on inventory
         */
        const getAvailability = (variant: any) => {
            if (variant.inventory_quantity > 0) {
                return 'https://schema.org/InStock';
            } else if (variant.allow_backorder) {
                return 'https://schema.org/BackOrder';
            } else {
                return 'https://schema.org/OutOfStock';
            }
        };

        /**
         * TypeScript-safe way to access product properties
         */
        const safeProductAccess = (product: any) => {
            return {
                collection: product?.collection || null,
                variants: product?.variants || [],
                images: product?.images || [],
                metadata: product?.metadata || null,
                weight: product?.weight || null,
                length: product?.length || null,
                width: product?.width || null,
                height: product?.height || null,
            };
        };

        const safeProduct = safeProductAccess(product);

        // Get all unique currencies from all variants
        const allCurrencies = new Set<string>();
        safeProduct.variants.forEach((variant: any) => {
            variant.prices?.forEach((price: any) => {
                allCurrencies.add(price.currency_code);
            });
        });

        // Create offers for each currency
        const offers = Array.from(allCurrencies)
            .map((currency: string) => {
                const sampleVariant = safeProduct.variants.find(
                    (variant: any) =>
                        variant.prices?.some(
                            (price: any) => price.currency_code === currency
                        )
                );

                if (!sampleVariant) return null;

                const priceData = sampleVariant.prices?.find(
                    (price: any) => price.currency_code === currency
                );

                if (!priceData) return null;

                const formattedPrice = formatCryptoPrice(
                    priceData.amount,
                    priceData.currency_code,
                    true
                ).toString();

                return {
                    '@type': 'Offer',
                    url: `https://hamza.market/${countryCode}/products/${product.handle}`,
                    priceCurrency: priceData.currency_code.toUpperCase(),
                    price: formattedPrice,
                    availability: getAvailability(sampleVariant),
                    itemCondition: 'https://schema.org/NewCondition',
                    seller: {
                        '@type': 'Organization',
                        name: storeData?.name || 'Hamza Market',
                        url: storeData?.handle
                            ? `https://hamza.market/${countryCode}/store/${storeData.handle}`
                            : 'https://hamza.market',
                    },
                };
            })
            .filter(Boolean);

        // Base schema object
        const schema: any = {
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: product.title,
            description: product.description
                ? stripHtmlTags(product.description)
                : '',
            image: safeProduct.images.map((img: any) => img.url),

            brand: {
                '@type': 'Brand',
                name: storeData?.name || 'Hamza Market',
                url: storeData?.handle
                    ? `https://hamza.market/${countryCode}/store/${storeData.handle}`
                    : 'https://hamza.market',
            },

            offers: offers,
        };

        // Add SKU if available
        if (safeProduct.variants[0]?.sku) {
            schema.sku = safeProduct.variants[0].sku;
        }

        // Add MPN from metadata if available
        if (
            safeProduct.metadata &&
            typeof safeProduct.metadata === 'object' &&
            'mpn' in safeProduct.metadata &&
            safeProduct.metadata.mpn
        ) {
            schema.mpn = safeProduct.metadata.mpn;
        }

        // Add GTINs if available
        if (safeProduct.variants[0]?.upc) {
            schema.gtin12 = safeProduct.variants[0].upc;
        }
        if (safeProduct.variants[0]?.ean) {
            schema.gtin13 = safeProduct.variants[0].ean;
        }

        // Add weight if available
        if (safeProduct.weight) {
            schema.weight = {
                '@type': 'QuantitativeValue',
                value: safeProduct.weight,
                unitCode: 'GRM',
            };
        }

        // Add product category if available
        if (safeProduct.collection?.title) {
            schema.category = safeProduct.collection.title;
        }

        // Add dimensions if available
        const hasAnyDimension =
            safeProduct.length || safeProduct.width || safeProduct.height;
        if (hasAnyDimension) {
            schema.additionalProperty = [];

            if (safeProduct.length) {
                schema.additionalProperty.push({
                    '@type': 'PropertyValue',
                    name: 'Length',
                    value: safeProduct.length,
                    unitCode: 'CMT',
                });
            }

            if (safeProduct.width) {
                schema.additionalProperty.push({
                    '@type': 'PropertyValue',
                    name: 'Width',
                    value: safeProduct.width,
                    unitCode: 'CMT',
                });
            }

            if (safeProduct.height) {
                schema.additionalProperty.push({
                    '@type': 'PropertyValue',
                    name: 'Height',
                    value: safeProduct.height,
                    unitCode: 'CMT',
                });
            }
        }

        // Add product URL
        schema.url = `https://hamza.market/${countryCode}/products/${product.handle}`;

        return schema;
    };

    return (
        <Flex
            flexDirection="column"
            justifyContent={'center'}
            alignItems={'center'}
            maxW="1280px"
            width={'100%'}
            mx="auto"
        >
            {product && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(
                            generateProductJsonLd(),
                            null,
                            2
                        ),
                    }}
                />
            )}
            <Flex
                maxW="1280px"
                width={'calc(100% - 2rem)'}
                mx="rem"
                flexDirection="column"
            >
                <Flex
                    mt={{ base: '0', md: '1rem' }}
                    mb="-1rem"
                    height={'52px'}
                    width="100%"
                    flexDirection={'row'}
                    display={{ base: 'none', md: 'flex' }}
                >
                    <LocalizedClientLink
                        style={{
                            display: 'flex',
                            backgroundColor: '#121212',
                            alignItems: 'center',
                            padding: '0 16px',
                            color: 'white',
                            justifyContent: 'center',
                            borderColor: '#3E3E3E',
                            borderWidth: '1px',
                            borderRadius: '16px',
                            height: '52px',
                        }}
                        className="ml-auto"
                    >
                        <Flex width={'30px'} height={'40px'}>
                            <Flex
                                width={'20px'}
                                height={'20px'}
                                alignSelf={'center'}
                            >
                                <FaArrowLeftLong
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        alignSelf: 'center',
                                    }}
                                />
                            </Flex>
                        </Flex>
                        <Text>Back to results</Text>
                    </LocalizedClientLink>
                </Flex>
                <Flex
                    mt={{ base: '1rem', md: '2rem' }}
                    mb={{ base: '-1rem', md: '0' }}
                >
                    <PreviewGallery
                        handle={handle}
                        selectedVariantImage={selectedVariantImage}
                    />
                </Flex>
                <Flex
                    maxWidth="1280px"
                    width="100%"
                    my="2rem"
                    gap="26px"
                    justifyContent="center"
                    flexDirection={{ base: 'column', md: 'row' }}
                >
                    <Flex flex="1" order={{ base: 2, md: 1 }}>
                        <Flex flexDirection="column">
                            <ProductInfo handle={handle} />
                            {/*<Box mt="1.5rem">*/}
                            {/*    <Tweet*/}
                            {/*        productHandle={product.handle as string}*/}
                            {/*        isPurchased={false}*/}
                            {/*    />*/}
                            {/*</Box>*/}
                        </Flex>
                    </Flex>
                    <Flex
                        maxW={{ base: '100%', md: '504px' }}
                        width="100%"
                        flex="0 0 auto"
                        justifyContent="center"
                        order={{ base: 1, md: 2 }}
                        alignSelf="flex-start"
                    >
                        <PreviewCheckout
                            selectedVariantImage={selectedVariantImage}
                            setSelectedVariantImage={setSelectedVariantImage}
                            productId={product.id as string}
                            handle={handle}
                        />
                    </Flex>
                </Flex>
                {isStoreLoading ? (
                    <Spinner /> // Or some loading placeholder for StoreBanner
                ) : isStoreError ? (
                    <Text>Error loading store details</Text> // Handle error case gracefully
                ) : (
                    <StoreBanner
                        storeHandle={storeData?.handle}
                        storeName={storeData?.name}
                        icon={storeData?.icon}
                    />
                )}
                <Divider
                    color="#555555"
                    display={{ base: 'block', md: 'none' }}
                    mt="2rem"
                />
                <ProductReview />
            </Flex>
        </Flex>
    );
};

export default ProductTemplate;
