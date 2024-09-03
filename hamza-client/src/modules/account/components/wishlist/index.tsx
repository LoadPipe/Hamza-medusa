'use client';

import React from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';
import WishlistCard from './components/wishlist-card';
import useWishlistStore from '@store/wishlist/wishlist-store';

interface AccountWishListProps {
    countryCode: string; // Accept region as a prop
}
const AccountWishList: React.FC<AccountWishListProps> = ({ countryCode }) => {
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));

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
                            productPrice={product.price.toString()}
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
