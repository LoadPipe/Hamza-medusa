'use client';

import React from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';
import WishlistCard from './components/wishlist-card';
import useWishlistStore from '@/zustand/wishlist/wishlist-store';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { acceptedCurrencyCodes } from '@/lib/util/currencies';

interface AccountWishListProps {
    countryCode: string; // Accept region as a prop
}

type PriceDictionary = {
    eth?: string;
    usdc?: string;
    usdt?: string;
};

const AccountWishList: React.FC<AccountWishListProps> = ({ countryCode }) => {
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));

    const { preferred_currency_code } = useCustomerAuthStore();

    console.log(`WISHLIST: ${JSON.stringify(wishlist.products)}`);

    const convertPrice = (
        productPrice: any,
        preferred_currency_code: string
    ) => {
        console.log('WISHLIST ITEM PRICE IS', productPrice);
        if (
            typeof productPrice === 'number' ||
            typeof productPrice === 'string'
        ) {
            return productPrice;
        } else if (
            productPrice &&
            typeof productPrice === 'object' &&
            preferred_currency_code &&
            acceptedCurrencyCodes.includes(preferred_currency_code ?? 'usdc')
        ) {
            return productPrice[
                preferred_currency_code as keyof PriceDictionary
            ];
        } else {
            console.log(`Product Error`);
            return;
        }
    };

    return (
        <Box color={'white'}>
            {wishlist.products && wishlist.products.length > 0 ? (
                wishlist.products.map((product, index) => (
                    <Box key={index} mt={index > 0 ? '1rem' : 0}>
                        <WishlistCard
                            key={index}
                            productData={product}
                            productId={product.id}
                            productVariantId={product.productVariantId}
                            productImage={product.thumbnail}
                            productVariantImage={product.variantThumbnail}
                            productDescription={product.title}
                            productPrice={convertPrice(
                                product.price,
                                preferred_currency_code ?? 'usdc'
                            )}
                            countryCode={countryCode}
                        />
                    </Box>
                ))
            ) : (
                <Flex
                    justifyContent="center"
                    alignItems="center"
                    height="100vh"
                >
                    <Text fontSize="lg" color="white">
                        Your wishlist is currently empty.
                    </Text>
                </Flex>
            )}
        </Box>
    );
};

export default AccountWishList;
