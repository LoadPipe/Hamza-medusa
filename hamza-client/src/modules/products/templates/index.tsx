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
import useProductPreview from '@store/product-preview/product-preview';
import StoreBanner from '../components/product-preview/components/store-banner/store-banner';
import SearchBar from '../components/product-preview/components/mobile-search';
import Tweet from '@/components/tweet';
import { MdChevronLeft } from 'react-icons/md';
import { getStore } from '@lib/data';
import { BiBorderRadius } from 'react-icons/bi';

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

    const [store, setStore] = useState('');
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
                setStore(data.name);
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
                    mt="1rem"
                    mb="-1rem"
                    height={'52px'}
                    width="100%"
                    flexDirection={'row'}
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
                        className="ml-auto "
                    >
                        <Flex width={'40px'} height={'40px'} ml="-0.5rem">
                            <MdChevronLeft
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    alignSelf: 'center',
                                }}
                            />
                        </Flex>
                        <Text>Back to results</Text>
                    </LocalizedClientLink>

                    <SearchBar />
                </Flex>
                <Flex mt="2rem" mb={{ base: '-1rem', md: '0' }}>
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
                            <Box mt="1.5rem">
                                <Tweet
                                    productHandle={product.handle as string}
                                    isPurchased={false}
                                />
                            </Box>
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
                            setSelectedVariantImage={setSelectedVariantImage}
                            productId={product.id as string}
                        />
                    </Flex>
                </Flex>
                <StoreBanner store={store} icon={icon} />
                <Divider
                    color="#555555"
                    display={{ base: 'block', md: 'none' }}
                    mt="2rem"
                />
                <ProductReview productId={product.id as string} />
            </Flex>
        </Flex>
    );
};

export default ProductTemplate;

{
    /* <div className="content-container flex flex-col small:flex-row small:items-start py-6 relative bg-black">
<div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
    <ProductInfo product={product} />
    <ProductTabs product={product} />
</div>
<div className="block w-full relative">
    <ImageGallery images={product?.images || []} />
</div>
<div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
    <ProductOnboardingCta />
    <Suspense
        fallback={
            <ProductActions product={product} region={region} />
        }
    >
        <ProductActionsWrapper
            id={product.id}
            region={region}
        />
    </Suspense>
</div>
</div>
<div className="content-container py-16 small:py-32 bg-black">
<ProductReview product={product} countryCode={countryCode} />
</div>
<div className="content-container py-16 small:py-32 bg-black">
<Suspense fallback={<SkeletonRelatedProducts />}>
    <RelatedProducts
        product={product}
        countryCode={countryCode}
    />
</Suspense>
</div> */
}
