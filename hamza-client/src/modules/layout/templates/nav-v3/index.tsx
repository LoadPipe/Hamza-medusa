import React from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import CartButton from '@modules/layout/components/cart-button';
import WishListPopover from '@/components/wishlist-dropdown';
import Wishlist from '@/components/wishlist';
import SideMenu from '@modules/layout/components/side-menu';
import { WalletConnectButton } from '@/components/providers/rainbowkit/connect-button/connect-button';

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
import Image from 'next/image';
import HamzaLogo from '../../../../../public/images/logo/logo_green.svg';
import HamzaTitle from '../../../../../public/images/logo/hamza-title.svg';
import { IoMdMenu } from 'react-icons/io';
import Link from 'next/link';
import NavLink from './components/nav-link';
import { CgProfile, CgBell } from 'react-icons/cg';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import AuthorizedLinks from './components/authorized-links';
import ConnectWalletLink from './components/connect-wallet-link';
import NavSearchBar from './components/nav-searchbar';
import MobileMenu from './components/mobile-menu';
import MobileNav from './components/mobile-nav';

export default async function Nav() {
    return (
        <Flex
            zIndex={'2'}
            className="sticky top-0"
            width="100%"
            height={{ base: '60px', md: '125px' }}
            justifyContent={'center'}
            alignItems={'center'}
            backgroundColor={'#020202'}
        >
            <MobileNav />
            <Flex
                display={{ base: 'none', md: 'flex' }}
                h={'87px'}
                mx="1rem"
                maxWidth={'1280px'}
                width={'100%'}
                bgColor={'transparent'}
                alignItems="center"
            >
                <Flex
                    width={'100%'}
                    justifyContent={'center'}
                    alignItems="center"
                >
                    <MobileMenu />
                    <LocalizedClientLink href="/">
                        <Flex width={'190px'} marginLeft="auto" flexShrink={0}>
                            <Image
                                className="w-[22.92px] h-[33px] md:w-[47.34px] md:h-[67px]"
                                src={HamzaLogo}
                                alt="Hamza"
                            />

                            <Image
                                src={HamzaTitle}
                                className="w-[60.73px] h-[11.59px] md:w-[125.42px] md:h-[23.07px] ml-[0.5rem] md:ml-[1rem]"
                                style={{
                                    alignSelf: 'center',
                                }}
                                alt="Hamza"
                            />
                        </Flex>
                    </LocalizedClientLink>

                    <Flex width={'100%'} display={{ base: 'none', md: 'flex' }}>
                        <NavSearchBar />
                    </Flex>

                    <Link
                        href="https://blog.hamza.biz/affiliate"
                        target="_blank"
                    >
                        <Flex
                            flexShrink={0}
                            width={'162px'}
                            height={'52px'}
                            borderWidth={'1px'}
                            borderRadius={'full'}
                            borderColor="white"
                            alignSelf={'center'}
                            justifyContent={'center'}
                            marginLeft={'auto'}
                            backgroundColor={'transparent'}
                            color="White"
                            cursor={'pointer'}
                            display={{ base: 'none', md: 'flex' }}
                            _hover={{
                                color: 'primary.green.900',
                                borderColor: 'primary.green.900',
                                transition:
                                    'color 0.2s ease-in-out, border-color 0.2s ease-in-out',
                            }}
                        >
                            <Text
                                fontWeight={'600'}
                                fontSize={'16px'}
                                alignSelf={'center'}
                                textAlign={'center'}
                            >
                                Sell on Hamza
                            </Text>
                        </Flex>
                    </Link>
                    <Flex display={{ base: 'none', md: 'flex' }}>
                        <Menu placement="bottom-end">
                            <MenuButton
                                flexShrink={0}
                                width={'115px'}
                                height={'52px'}
                                px="1rem"
                                borderRadius={'full'}
                                justifyContent={'center'}
                                alignSelf={'center'}
                                marginLeft={{ base: 'auto', md: '1rem' }}
                                backgroundColor={{
                                    base: 'transparent',
                                    md: 'primary.green.900',
                                }}
                                cursor={'pointer'}
                            >
                                <Flex>
                                    <Flex alignSelf={'center'} color={'black'}>
                                        <IoMdMenu size={30} />
                                    </Flex>
                                    <Flex
                                        marginLeft={'auto'}
                                        alignSelf={'center'}
                                    >
                                        <CgProfile color="black" size={30} />
                                    </Flex>
                                </Flex>
                            </MenuButton>
                            <MenuList
                                marginTop={'1rem'}
                                pb={'0px'}
                                borderTopRadius={'0px'}
                                borderBottomRadius={'16px'}
                                borderColor={{
                                    base: 'transparent',
                                    md: 'white',
                                }}
                                backgroundColor={'black'}
                                width={{ base: '100vw', md: '321px' }}
                            >
                                <MenuItem
                                    mt="0.5rem"
                                    mb="1rem"
                                    fontWeight={'600'}
                                    px="2rem"
                                    flex={1}
                                    color={'white'}
                                    backgroundColor={'black'}
                                >
                                    <CartButton />
                                </MenuItem>
                                <Wishlist />
                                <Box px={{ base: '2rem', md: 0 }}>
                                    <MenuDivider
                                        opacity={{ base: '0.5', md: '1' }}
                                        borderColor={'white'}
                                    />
                                </Box>
                                <Link
                                    href={`https://blog.hamza.biz/merchant/`}
                                    target="_blank"
                                >
                                    <MenuItem
                                        fontWeight={'600'}
                                        mt="1rem"
                                        px="2rem"
                                        color={'white'}
                                        backgroundColor={'black'}
                                        _hover={{ color: 'primary.green.900' }}
                                    >
                                        Sell on Hamza
                                    </MenuItem>
                                </Link>
                                <Link
                                    href={`https://blog.hamza.biz/affiliate/`}
                                    target="_blank"
                                >
                                    <MenuItem
                                        fontWeight={'600'}
                                        mb="1rem"
                                        px="2rem"
                                        color={'white'}
                                        backgroundColor={'black'}
                                        _hover={{ color: 'primary.green.900' }}
                                    >
                                        Be an affiliate
                                    </MenuItem>
                                </Link>
                                <Box px={{ base: '2rem', md: 0 }}>
                                    <MenuDivider
                                        opacity={{ base: '0.5', md: '1' }}
                                        borderColor={'white'}
                                    />
                                </Box>

                                <AuthorizedLinks />
                                <NavLink href={`/`}>
                                    <MenuItem
                                        fontWeight={'600'}
                                        mt="1rem"
                                        px="2rem"
                                        color={'white'}
                                        backgroundColor={'black'}
                                        _hover={{ color: 'primary.green.900' }}
                                    >
                                        <Text>Home</Text>
                                    </MenuItem>
                                </NavLink>
                                <NavLink href={`/store`}>
                                    <MenuItem
                                        fontWeight={'600'}
                                        px="2rem"
                                        color={'white'}
                                        backgroundColor={'black'}
                                        _hover={{ color: 'primary.green.900' }}
                                    >
                                        <Text> Market</Text>
                                    </MenuItem>
                                </NavLink>

                                <a
                                    target="_blank"
                                    href="https://blog.hamza.biz/about/"
                                >
                                    <MenuItem
                                        fontWeight={'600'}
                                        px="2rem"
                                        color={'white'}
                                        backgroundColor={'black'}
                                        _hover={{ color: 'primary.green.900' }}
                                    >
                                        About Us
                                    </MenuItem>
                                </a>

                                <a
                                    target="_blank"
                                    href="https://blog.hamza.biz/contact/"
                                >
                                    <MenuItem
                                        fontWeight={'600'}
                                        px="2rem"
                                        mb="1.5rem"
                                        color={'white'}
                                        backgroundColor={'black'}
                                        _hover={{ color: 'primary.green.900' }}
                                    >
                                        Help Center
                                    </MenuItem>
                                </a>

                                <MenuDivider
                                    display={{ base: 'none', md: 'flex' }}
                                    mb="0"
                                    opacity={'1'}
                                    borderColor={'white'}
                                />

                                <ConnectWalletLink />
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}
