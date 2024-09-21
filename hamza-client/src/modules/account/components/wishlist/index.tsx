'use client';

import React from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';
import WishlistCard from './components/wishlist-card';
import useWishlistStore from '@store/wishlist/wishlist-store';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { formatCryptoPrice } from '@lib/util/get-product-price';

interface AccountWishListProps {
    countryCode: string; // Accept region as a prop
}
const AccountWishList: React.FC<AccountWishListProps> = ({ countryCode }) => {
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));

    const { preferred_currency_code } = useCustomerAuthStore();

    console.log(`WISHLIST: ${JSON.stringify(wishlist.products)}`);

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
                            productDescription={product.title}
                            productPrice={
                                typeof product.price === 'number' ||
                                typeof product.price === 'string'
                                    ? Number(product.price) // Pass the raw number if it's a string or number (client-side)
                                    : product.price[
                                          preferred_currency_code as keyof PriceDictionary
                                      ] || product.price.eth // Extract the correct price from the PriceDictionary
                            }
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
