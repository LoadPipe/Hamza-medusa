'use client';

import React, { useState, Suspense } from 'react';
import ProductCard from './components/product-card';
import { SimpleGrid, Container } from '@chakra-ui/react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { addToCart } from '@modules/cart/actions';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import SkeletonProductGrid from '@modules/skeletons/components/skeleton-product-grid';
import { getProductsByStoreName } from '@lib/data';

type Props = {
    vendorName: string;
    category?: string;
};

const ProductCardGroup = ({ vendorName, category }: Props) => {
    // Get products from vendor
    const { data, error, isLoading } = useQuery(
        ['products', { vendor: vendorName }],
        () =>
            getProductsByStoreName(vendorName).catch((err) => {
                console.log(err);
                return null;
            })
    );

    console.log(data);

    const { authData, preferred_currency_code } = useCustomerAuthStore();
    //console.log('user preferred currency code: ', preferred_currency_code);

    if (isLoading) {
        return <SkeletonProductGrid />;
    }

    const err: any = error ? error : null;
    if (err) return <div>Error: {err?.message}</div>;

    const products = data?.data;
    console.log(`Products ${JSON.stringify(products)}`);

    //TODO: Make product card clickable to product preview
    return (
        <Container maxW="1280px" py="8" backgroundColor={'transparent'}>
            <SimpleGrid
                columns={{ base: 1, md: 2, lg: 4 }}
                spacing="1.25rem"
                rowGap="2.5rem"
                placeItems="center"
            >
                <Suspense fallback={<SkeletonProductGrid />}>
                    {products.map((product: any, index: number) => {
                        const variantPrices = product.variants
                            .map((variant: any) => variant.prices)
                            .flat();

                        let variantID = product.variants[0].id;
                        const reviewCounter = product.reviews.length;
                        const totalRating = product.reviews.reduce(
                            (acc: number, review: any) => acc + review.rating,
                            0
                        );
                        const avgRating = reviewCounter
                            ? totalRating / reviewCounter
                            : 0;
                        const productPricing = formatCryptoPrice(
                            variantPrices.find(
                                (p: any) =>
                                    p.currency_code === preferred_currency_code
                            )?.amount || 0,
                            preferred_currency_code as string
                        );
                        variantID = product.variants[0].id;

                        return (
                            <ProductCard
                                key={index}
                                productHandle={products[index].handle}
                                reviewCount={reviewCounter}
                                totalRating={avgRating}
                                variantID={variantID}
                                countryCode={product.countryCode}
                                productName={product.title}
                                productPrice={productPricing}
                                currencyCode={preferred_currency_code ?? 'usdc'}
                                imageSrc={product.thumbnail}
                                hasDiscount={product.is_giftcard}
                                discountValue={product.discountValue}
                                productId={product.id}
                                inventory={
                                    product.variants[0]?.inventory_quantity
                                }
                                allow_backorder={
                                    product.variants[0].allow_backorder
                                }
                                storeId={product.store_id}
                            />
                        );
                    })}
                </Suspense>
            </SimpleGrid>
        </Container>
    );
};

export default ProductCardGroup;
