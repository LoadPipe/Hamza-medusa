'use client';
import React from 'react';
import Wishlist from '@/components/wishlist';
import {
    Flex,
    Text,
    Box,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Center,
    Image,
} from '@chakra-ui/react';
import Link from 'next/link';
import { CgProfile } from 'react-icons/cg';
import { MdOutlinePersonOutline, MdOutlineShield } from 'react-icons/md';
import { AiFillSetting } from 'react-icons/ai';
import { AuthorizedAccount } from '../../menu-desktop/components/authorized-account';
import useWishlistStore from '@/zustand/wishlist/wishlist-store';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import ProfileImage from '@/modules/common/components/customer-icon/profile-image';

const MobileAccountMenu = () => {
    const { authData } = useCustomerAuthStore();
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));
    const totalItems =
        wishlist?.products?.reduce((acc: any, item: any) => {
            return acc + 1;
        }, 0) || 0;

    return (
        <Menu placement="bottom-end">
            <MenuButton
                width={'26px'}
                height={'26px'}
                borderRadius={'full'}
                borderColor={'white'}
                borderWidth={'1px'}
                backgroundColor={'transparent'}
                cursor={'pointer'}
                position="relative"
                _hover={{
                    '.profile-icon': {
                        color: 'primary.green.900',
                        transition: 'color 0.3s ease-in-out',
                    },
                    borderColor: 'primary.green.900',
                    transition: 'border-color 0.3s ease-in-out',
                }}
            >
                <ProfileImage centered={true} />
                {totalItems > 0 && (
                    <Flex
                        position="absolute"
                        top="-4px"
                        right="-4px"
                        width="15px"
                        height="15px"
                        borderRadius="full"
                        backgroundColor="#EB4C60"
                        justifyContent="center"
                        alignItems="center"
                        fontSize="10px"
                        color="white"
                        fontWeight="700"
                    >
                        <Text fontSize={'10px'}>{totalItems}</Text>
                    </Flex>
                )}
            </MenuButton>
            <MenuList
                marginTop={'1rem'}
                px={'1rem'}
                py={'0px'}
                borderWidth={'0px'}
                backgroundColor={'transparent'}
                justifyContent={'center'}
                width={`calc(100vw)`}
            >
                <MenuList
                    borderRadius={'16px'}
                    borderColor={'#555555'}
                    borderWidth={'1px'}
                    pb={'0px'}
                    width={'100%'}
                    backgroundColor={'#121212'}
                >
                    <Wishlist />

                    <MenuDivider borderColor={'#555555'} />

                    <Link href={`/account/profile`}>
                        <MenuItem
                            fontWeight={'600'}
                            my="1rem"
                            pl="1rem"
                            color={'white'}
                            backgroundColor={'#121212'}
                            _hover={{ color: 'primary.green.900' }}
                        >
                            <Flex
                                w={'30px'}
                                alignContent={'center'}
                                justifyContent={'center'}
                            >
                                <MdOutlinePersonOutline size={30} />
                            </Flex>
                            <Text fontWeight={'600'} ml="0.5rem">
                                Manage My Account
                            </Text>
                        </MenuItem>
                    </Link>
                    {authData.is_verified === false && (
                        <Link href={`/account/verify`}>
                            <MenuItem
                                fontWeight={'600'}
                                pl="1rem"
                                mt="-1rem"
                                mb="1rem"
                                color={'white'}
                                backgroundColor={'#121212'}
                                _hover={{ color: 'primary.green.900' }}
                            >
                                <Flex
                                    w={'30px'}
                                    alignContent={'center'}
                                    justifyContent={'center'}
                                >
                                    <MdOutlineShield size={29} />
                                </Flex>
                                <Text fontWeight={'600'} ml="0.5rem">
                                    Verify Account
                                </Text>
                            </MenuItem>
                        </Link>
                    )}
                    <MenuDivider mb="0" borderColor={'#555555'} />
                    <AuthorizedAccount />
                </MenuList>
            </MenuList>
        </Menu>
    );
};

export default MobileAccountMenu;
