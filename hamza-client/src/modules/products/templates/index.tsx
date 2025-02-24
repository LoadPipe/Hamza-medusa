'use client';

import { Region } from '@medusajs/medusa';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import React, { Suspense, useEffect, useState } from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

// import ProductReview from '@modules/products/components/product-review';
// import ProductInfo from '@modules/products/templates/product-info';
import { notFound } from 'next/navigation';
import { Box, Flex, Divider, Text } from '@chakra-ui/react';
import PreviewGallery from '../components/product-preview/components/image-gallery/image-display/preview-gallery';
import ProductInfo from '../components/product-preview/components/product-info/product-info';
import PreviewCheckout from '../components/product-preview/components/summary/preview-checkout';
import ProductReview from '../components/product-preview/components/product-review';
import ProductReviewMobile from '../components/product-preview/components/product-review-mobile';
import useProductPreview from '@/zustand/product-preview/product-preview';
import StoreBanner from '../components/product-preview/components/store-banner/store-banner';
import SearchBar from '../components/product-preview/components/mobile-search';
// import Tweet from '@/components/tweet';
import { MdChevronLeft } from 'react-icons/md';
import { getStore } from '@lib/data';
import { BiBorderRadius } from 'react-icons/bi';
import { FaArrowLeftLong } from 'react-icons/fa6';

type ProductTemplateProps = {
    product: PricedProduct;
    region: Region;
    countryCode: string;
};

const ProductTemplate: React.FC<ProductTemplateProps> = ({
    product,
    region,
    countryCode,
}) => {
    const {
        setProductData,
        setCountryCode,
        setRegionId,
        setProductId,
        setQuantity,
    } = useProductPreview();

    const [storeName, setstoreName] = useState('');
    const [storeHandle, setstorehandle] = useState('');
    const [icon, setIcon] = useState('');
    const [selectedVariantImage, setSelectedVariantImage] = useState('');

    // Only update product data when `product` changes
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

    // if (!product || !product.id) {
    //     return null; // Return null or some error display components
    // }
    // console.log(
    //     `Product Page, we have product ${product.id} ${product.handle}`
    // );

    useEffect(() => {
        // Fetch Vendor Name from product.id
        const fetchVendor = async () => {
            try {
                const data = await getStore(product.id as string);
                // console.log(`Vendor: ${data}`);
                setstoreName(data.name);
                setstorehandle(data.handle);
                setIcon(data.icon);
            } catch (error) {
                console.error('Error fetching vendor: ', error);
            }
        };

        fetchVendor();
    }, [product]);

    return (
        <Flex
            flexDirection="column"
            justifyContent={'center'}
            alignItems={'center'}
            maxW="1280px"
            width={'100vw'}
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
                            <ProductInfo />
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
                        />
                    </Flex>
                </Flex>
                <StoreBanner
                    storeName={storeName}
                    storeHandle={storeHandle}
                    icon={icon}
                />
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
