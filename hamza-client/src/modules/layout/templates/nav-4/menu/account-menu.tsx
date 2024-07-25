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
} from '@chakra-ui/react';
import Link from 'next/link';
import { CgProfile } from 'react-icons/cg';
import { MdOutlinePersonOutline } from 'react-icons/md';
import { AiFillSetting } from 'react-icons/ai';
import { AuthorizedAccount } from './components/authorized-account';
import useWishlistStore from '@store/wishlist/wishlist-store';

const AccountMenu = () => {
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));
    const totalItems =
        wishlist?.products?.reduce((acc: any, item: any) => {
            return acc + 1;
        }, 0) || 0;

    return (
        <Flex display={{ base: 'none', md: 'flex' }} height={'100%'}>
            <Menu placement="bottom-end">
                <MenuButton
                    width={'60px'}
                    height={'57px'}
                    px="1rem"
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
                    <Flex
                        alignSelf={'center'}
                        className="profile-icon"
                        color={'white'}
                    >
                        <CgProfile size={30} />
                    </Flex>
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
                    <Link href={`/account`}>
                        <MenuItem
                            fontWeight={'600'}
                            mt="1rem"
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
                                Profile
                            </Text>
                        </MenuItem>
                    </Link>
                    <Link href={`/account`}>
                        <MenuItem
                            fontWeight={'600'}
                            mb="1rem"
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
                                <AiFillSetting size={26} />
                            </Flex>
                            <Text fontWeight={'600'} ml="0.5rem">
                                Settings
                            </Text>
                        </MenuItem>
                    </Link>
                    <AuthorizedAccount />
                </MenuList>
            </Menu>
        </Flex>
    );
};

export default AccountMenu;
