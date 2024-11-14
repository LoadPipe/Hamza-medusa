'use client';
import React, { useEffect } from 'react';
import useWishlistStore from '@/zustand/wishlist/wishlist-store';
import WishlistItem from '@/components/wishlist-dropdown/WishlistItem';
import { SimpleGrid, Flex, Text, Box } from '@chakra-ui/react';

const Wishlist = () => {
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));

    console.log('wishlist-dropdown items??', wishlist?.products);

    return (
        <div className="layout-base bg-black flex justify-center min-h-screen">
            <div className="flex flex-col items-center w-full">
                <div className="my-8">
                    <h1 className="font-semibold text-4xl text-white text-center">
                        Wishlist
                    </h1>
                </div>
                <div className="w-full px-16">
                    {wishlist &&
                    wishlist.products &&
                    wishlist.products?.length > 0 ? (
                        <SimpleGrid
                            columns={{ base: 1, md: 2, lg: 4 }}
                            justifyContent="center" // Ensure that grid items are centered if they don't fill the entire row
                            spacing={5}
                            className="text-white"
                        >
                            {wishlist.products?.map((product) => (
                                <WishlistItem key={product.id} item={product} />
                            ))}
                        </SimpleGrid>
                    ) : (
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            minHeight="200px"
                        >
                            <Text
                                fontSize="xl"
                                color="white"
                                textAlign="center"
                            >
                                You don't have any items in your wishlist
                            </Text>
                        </Flex>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
