'use client';

import React from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';
import WishlistCard from './components/wishlist-card';
import useWishlistStore from '@store/wishlist/wishlist-store';

const AccountWishList = () => {
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));

    return (
        <Box color={'white'}>
            {wishlist.products?.map((product, index) => (
                <Box key={index} mt={index > 0 ? '1rem' : 0}>
                    <WishlistCard
                        key={index}
                        vendorThumbnail="Vendor Thumbnail Here"
                        productId={product.id}
                        productImage={product.thumbnail}
                        productDescription={product.title}
                        productPrice={product.price.toString()}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default AccountWishList;
