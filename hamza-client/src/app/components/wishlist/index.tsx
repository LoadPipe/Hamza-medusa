'use client';

import LocalizedClientLink from '@modules/common/components/localized-client-link';
import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

import { Flex, Text, MenuItem } from '@chakra-ui/react';
import useWishlistStore from '@store/wishlist/wishlist-store';
import { WishlistType } from '@store/wishlist/types/wishlist-types';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { FaRegHeart } from 'react-icons/fa';

interface WishlistPopoverItemProps {
    item?: WishlistType;
}

// TODO: Should we move this components to modules/wishlist/ similar to where cart-dropdown is???
const Wishlist: React.FC<WishlistPopoverItemProps> = () => {
    const { authData } = useCustomerAuthStore();
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));
    const totalItems =
        wishlist?.products?.reduce((acc: any, item: any) => {
            return acc + 1;
        }, 0) || 0;
    const itemRef = useRef<number>(totalItems || 0);
    const pathname = usePathname();

    useEffect(() => {
        if (itemRef.current !== totalItems && !pathname.includes('/wishlist')) {
            //timedOpen();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalItems, itemRef.current]);

    // console.log('Wishlist popover', wishlist);

    return (
        <>
            {authData.status === 'authenticated' ? (
                <MenuItem
                    mt="0.5rem"
                    mb="1rem"
                    fontWeight={'600'}
                    px="2rem"
                    color={'white'}
                    backgroundColor={'black'}
                >
                    <Flex width={'100%'}>
                        <LocalizedClientLink
                            className="w-full"
                            href="/wishlist"
                        >
                            <Flex
                                width={'100%'}
                                flex={1}
                                color="white"
                                _hover={{
                                    '.wishlist-text, .wishlist-icon': {
                                        color: 'primary.green.900',
                                    },
                                }}
                            >
                                <Flex
                                    flexDirection={'row'}
                                    alignSelf={'center'}
                                >
                                    <FaRegHeart
                                        className="wishlist-icon"
                                        size={'24px'}
                                    />
                                    <Text
                                        className="wishlist-text"
                                        fontSize={'16px'}
                                        fontWeight={'700'}
                                        ml="5px"
                                        _hover={{ color: 'primary.green.900' }}
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
                    </Flex>
                </MenuItem>
            ) : null}
        </>
    );
};

export default Wishlist;
