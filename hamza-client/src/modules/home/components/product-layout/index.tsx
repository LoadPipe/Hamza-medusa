'use client';

import React from 'react';
import ProductCard from './components/product-card';
import { SimpleGrid, Container } from '@chakra-ui/react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';

type Props = {
    vendorName: string;
    category: string;
};

const ProductCardGroup = ({ vendorName, category }: Props) => {
    const { data, error, isLoading } = useQuery(
        ['products', { vendor: vendorName }],
        () =>
            axios.get(
                `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/store/custom/products?store_name=${vendorName}`
            )
    );

    console.log(data);

    const { status, preferred_currency_code } = useCustomerAuthStore();

    if (isLoading) {
        return null; // Suspense will handle the loading fallback.
    }

    if (error) return <div>Error: {error?.message}</div>;

    const products = data?.data;

    //TODO: Make product card clickable to product preview
    return (
        <Container maxW="1440px" p="8" backgroundColor={'#2C272D'}>
            <SimpleGrid
                columns={[1, 2, 3, 4]}
                spacing="1.25rem"
                rowGap="2.5rem"
                placeItems="center"
            >
                {products.map((product: any) => {
                    const variantPrices = product.variants
                        .map((variant: any) => variant.prices)
                        .flat();
                    return (
                        <ProductCard
                            key={product.id}
                            productName={product.title}
                            productPrice={variantPrices[0].amount}
                            imageSrc={product.thumbnail}
                            hasDiscount={product.is_giftcard}
                            discountValue={product.discountValue}
                        />
                    );
                })}
            </SimpleGrid>
        </Container>
    );
};

export default ProductCardGroup;
