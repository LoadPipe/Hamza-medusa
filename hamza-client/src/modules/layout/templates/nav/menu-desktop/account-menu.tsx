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
    Image,
} from '@chakra-ui/react';
import Link from 'next/link';
import { CgProfile } from 'react-icons/cg';
import { MdOutlinePersonOutline, MdOutlineShield } from 'react-icons/md';
import { AiFillSetting } from 'react-icons/ai';
import { AuthorizedAccount } from './components/authorized-account';
import useWishlistStore from '@/zustand/wishlist/wishlist-store';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import ProfileImage from '@/account/@dashboard/profile/profile-form/components/customer-icon/profile-image';

const AccountMenu = () => {
    const { authData } = useCustomerAuthStore();
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));
    const totalItems =
        wishlist?.products?.reduce((acc: any, item: any) => {
            return acc + 1;
        }, 0) || 0;

    return (
        <Flex display={{ base: 'none', md: 'flex' }} height={'100%'} className="account-menu">
            <Menu placement="bottom-end">
                <MenuButton
                    width={'48px'}
                    height={'48px'}
                    borderRadius={'full'}
                    borderWidth={'1px'}
                    backgroundColor={'transparent'}
                    border={'none'}
                    cursor={'pointer'}
                    position="relative"
                    className="account-menu-button"
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
                            top="0px"
                            right="0px"
                            width="20px"
                            height="20px"
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
                    pb={'0px'}
                    borderRadius={'16px'}
                    borderColor={{
                        base: 'transparent',
                        md: 'white',
                    }}
                    backgroundColor={'black'}
                    width={{ base: '100vw', md: '321px' }}
                >
                    <Wishlist />
                    <Box px={{ base: '2rem', md: 0 }}>
                        <MenuDivider
                            opacity={{ base: '0.5', md: '1' }}
                            borderColor={'white'}
                        />
                    </Box>
                    <Link href={`/account/profile`} className="account-profile-link">
                        <MenuItem
                            fontWeight={'600'}
                            my="1rem"
                            pl="1rem"
                            color={'white'}
                            backgroundColor={'black'}
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
                                backgroundColor={'black'}
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
                    <MenuDivider
                        mb="0"
                        opacity={{ base: '0.5', md: '1' }}
                        borderColor={'white'}
                    />
                    <AuthorizedAccount />
                </MenuList>
            </Menu>
        </Flex>
    );
};

export default AccountMenu;
