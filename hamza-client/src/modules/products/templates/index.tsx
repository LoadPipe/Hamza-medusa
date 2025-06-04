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
import Head from 'next/head';
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
     * @returns {Object|null} Schema.org Product structured data
     */
    const generateProductJsonLd = () => {
        if (!product) return null;

        // Get all unique currencies from all variants
        const allCurrencies = new Set<string>();
        product.variants?.forEach(variant => {
            variant.prices?.forEach(price => {
                if (price.region_id === region.id || price.currency_code === region.currency_code) {
                    allCurrencies.add(price.currency_code);
                }
            });
        });

        // Create one offer per currency (not per variant to avoid duplicates)
        const offers = Array.from(allCurrencies).map((currency: string) => {
            // Find any variant with this currency
            const sampleVariant = product.variants?.find(variant =>
                variant.prices?.some(price =>
                    price.currency_code === currency &&
                    (price.region_id === region.id || price.currency_code === region.currency_code)
                )
            );

            if (!sampleVariant) return null;

            const priceData = sampleVariant.prices?.find(price =>
                price.currency_code === currency &&
                (price.region_id === region.id || price.currency_code === region.currency_code)
            );

            if (!priceData) return null;

            // Format price using existing crypto price formatter
            const formattedPrice = formatCryptoPrice(
                priceData.amount,
                priceData.currency_code,
                true
            );

            return {
                "@type": "Offer",
                "url": `https://hamza.market/${countryCode}/products/${product.handle}`,
                "priceCurrency": priceData.currency_code.toUpperCase(),
                "price": formattedPrice.toString(),
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition",
                "seller": {
                    "@type": "Organization",
                    "name": storeData?.name || "Hamza Market"
                }
            };
        }).filter(Boolean);

        const schema = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.title,
            "description": product.description || "",
            "image": product.images?.map(img => img.url) || [],
            "sku": product.variants?.[0]?.sku || undefined,

            // Add MPN if available in metadata
            ...(product.metadata && typeof product.metadata === 'object' && 'mpn' in product.metadata && {
                "mpn": product.metadata.mpn
            }),

            "brand": {
                "@type": "Brand",
                "name": storeData?.name || "Hamza Market"
            },

            // Use array if multiple currencies, single object if only one
            "offers": offers.length === 1 ? offers[0] : offers,
        };

        console.log('SCHEMA FOR VALIDATION:', JSON.stringify(schema, null, 2));

        return schema;
    };


    return (
        <>
            <Head>
                {product && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(generateProductJsonLd(), null, 2)
                        }}
                    />
                )}
            </Head>
            <Flex
                flexDirection="column"
                justifyContent={'center'}
                alignItems={'center'}
                maxW="1280px"
                width={'100%'}
                mx="auto"
            >
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
        </>
    );
};

export default ProductTemplate;