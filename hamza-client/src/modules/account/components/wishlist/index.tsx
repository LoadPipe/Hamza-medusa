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
            {wishlist.products?.map((product) => (
                <WishlistCard
                    key={product.id}
                    vendorThumbnail="Vendor Thumbnail Here"
                    vendorName={product.title}
                    productImage={product.thumbnail}
                    productDescription={product.title}
                    productPrice="$99.99"
                />
            ))}
        </Box>
    );
};

export default AccountWishList;
