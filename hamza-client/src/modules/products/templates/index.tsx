'use client';

import { Region } from '@medusajs/medusa';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import React, { Suspense, useEffect, useState } from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

import ImageGallery from '@modules/products/components/image-gallery';
import ProductActions from '@modules/products/components/product-actions';
import ProductOnboardingCta from '@modules/products/components/product-onboarding-cta';
import ProductTabs from '@modules/products/components/product-tabs';
import RelatedProducts from '@modules/products/components/related-products';
// import ProductReview from '@modules/products/components/product-review';
// import ProductInfo from '@modules/products/templates/product-info';
import SkeletonRelatedProducts from '@modules/skeletons/templates/skeleton-related-products';
import { notFound } from 'next/navigation';
import ProductActionsWrapper from './product-actions-wrapper';
import { Box, Flex, Divider, Text } from '@chakra-ui/react';
import PreviewGallery from '../components/product-preview/components/preview-gallery';
import ProductInfo from '../components/product-preview/components/product-info';
import PreviewCheckout from '../components/product-preview/components/preview-checkout';
import ProductReview from '../components/product-preview/components/product-review';
import ProductReviewMobile from '../components/product-preview/components/product-review-mobile';
import useProductPreview from '@store/product-preview/product-preview';
import VendorBanner from '../components/product-preview/components/vendor-banner';
import SearchBar from '../components/product-preview/components/mobile-search';
import axios from 'axios';
import Tweet from '@/components/tweet';
import { XMark } from '@medusajs/icons';
import { MdChevronLeft } from 'react-icons/md';

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

    const [vendor, setVendor] = useState('');

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
    //     return null; // Return null or some error display component
    // }
    console.log(
        `Product Page, we have product ${product.id} ${product.handle}`
    );

    useEffect(() => {
        // Fetch Vendor Name from product.id
        const fetchVendor = async () => {
            try {
                const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/custom/get-store`,
                    {
                        product_id: product.id,
                    }
                );
                console.log(`Vendor: ${data}`);
                setVendor(data);
            } catch (error) {
                console.error('Error fetching vendor: ', error);
            }
        };

        fetchVendor();
    }, [product]);

    return (
        <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mx="1rem"
        >
            <Flex
                mt="1rem"
                mb="-1rem"
                maxWidth="1280px"
                height={'52px'}
                width="100%"
                flexDirection={'row'}
            >
                <LocalizedClientLink href="/store">
                    <Flex
                        ml="-0.5rem"
                        height={'52px'}
                        flexDirection={'row'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        mt={'auto'}
                    >
                        <Flex
                            alignSelf={'center'}
                            flexDirection={'row'}
                            my="auto"
                        >
                            <MdChevronLeft color="white" size={40} />
                            <Text
                                alignSelf={'center'}
                                display={{ base: 'none', md: 'block' }}
                                color="white"
                            >
                                Back to products
                            </Text>
                        </Flex>
                    </Flex>
                </LocalizedClientLink>

                <SearchBar />
            </Flex>
            <Flex mt="2rem">
                <PreviewGallery />
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
                    <PreviewCheckout productId={product.id as string} />
                </Flex>
            </Flex>
            <VendorBanner vendor={vendor} />
            <Divider
                color="#555555"
                display={{ base: 'block', md: 'none' }}
                mt="2rem"
            />
            <ProductReview />
            <ProductReviewMobile />
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
