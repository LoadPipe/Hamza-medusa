'use client';

import LocalizedClientLink from '@modules/common/components/localized-client-link';
import React from 'react';
import { Flex, Text, MenuItem } from '@chakra-ui/react';
import useWishlistStore from '@/zustand/wishlist/wishlist-store';
import { WishlistType } from '@/zustand/wishlist/types/wishlist-types';
import { FaRegHeart } from 'react-icons/fa';

interface WishlistPopoverItemProps {
    item?: WishlistType;
}

// TODO: Should we move this components to modules/wishlist/ similar to where cart-dropdown is???
const Wishlist: React.FC<WishlistPopoverItemProps> = () => {
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));
    const totalItems =
        wishlist?.products?.reduce((acc: any, item: any) => {
            return acc + 1;
        }, 0) || 0;

    return (
        <MenuItem
            mt="0.5rem"
            mb="1rem"
            fontWeight={'600'}
            px="1rem"
            color={'white'}
            backgroundColor={'transparent'}
            _hover={{
                '.wishlist-text, .wishlist-icon': {
                    color: 'primary.green.900',
                },
            }}
        >
            <LocalizedClientLink className="w-full" href="/account/wishlist">
                <Flex width={'100%'} flex={1} color="white">
                    <Flex flexDirection={'row'} alignSelf={'center'}>
                        <Flex
                            w="30px"
                            alignItems={'center'}
                            justifyContent={'center'}
                        >
                            <FaRegHeart className="wishlist-icon" size={24} />
                        </Flex>
                        <Text
                            className="wishlist-text"
                            alignSelf={'center'}
                            fontWeight={'600'}
                            ml="0.5rem"
                        >
                            Wishlist
                        </Text>
                    </Flex>
                    <Flex
                        width={'21px'}
                        height={'21px'}
                        borderRadius={'full'}
                        backgroundColor={'#EB4C60'}
                        ml="auto"
                        justifyContent={'center'}
                        alignItems={'center'}
                        alignSelf={'center'}
                    >
                        <Text
                            fontSize={'13px'}
                            fontWeight={'700'}
                            alignSelf={'center'}
                        >{`${totalItems}`}</Text>
                    </Flex>
                </Flex>
            </LocalizedClientLink>
        </MenuItem>
    );
};

export default Wishlist;
