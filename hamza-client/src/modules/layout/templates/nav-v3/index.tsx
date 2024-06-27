import React from 'react';
import { Suspense, useState, useEffect } from 'react';
import { listRegions } from '@lib/data';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import CartButton from '@modules/layout/components/cart-button';
import WishListPopover from '@/components/wishlist-dropdown';
import SideMenu from '@modules/layout/components/side-menu';
import { WalletConnectButton } from '@/components/providers/rainbowkit/connect-button/connect-button';
import {
    Box,
    Flex,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Divider,
} from '@chakra-ui/react';
import Image from 'next/image';
import HamzaLogo from '../../../../../public/images/logo/logo_green.svg';
import HamzaTitle from '../../../../../public/images/logo/hamza-title.svg';
import { IoMdMenu } from 'react-icons/io';

import { CgProfile, CgBell } from 'react-icons/cg';

export default async function Nav() {
    const regions = await listRegions().then((regions) => regions);
    return (
        <Flex
            zIndex={'1'}
            className="sticky top-0"
            width="100%"
            height={'125px'}
            justifyContent={'center'}
            alignItems={'center'}
            backgroundColor={'#020202'}
        >
            <Flex
                h={'87px'}
                mx="1rem"
                maxWidth={'1280px'}
                width={'100%'}
                bgColor={'transparent'}
                display="flex"
                alignItems="center"
            >
                <Flex width={'100%'} alignSelf="center">
                    <LocalizedClientLink href="/">
                        <Flex>
                            <Image
                                src={HamzaLogo}
                                style={{ width: '100%', height: '67px' }}
                                alt="Hamza"
                            />

                            <Image
                                src={HamzaTitle}
                                style={{
                                    width: '100%',
                                    height: '23.07px',
                                    alignSelf: 'center',
                                    marginLeft: '1rem',
                                }}
                                alt="Hamza"
                            />
                        </Flex>
                    </LocalizedClientLink>
                    <Flex
                        width={'162px'}
                        height={'52px'}
                        borderWidth={'1px'}
                        borderRadius={'full'}
                        borderColor="white"
                        alignSelf={'center'}
                        justifyContent={'center'}
                        marginLeft={'auto'}
                        backgroundColor={'transparent'}
                        cursor={'pointer'}
                    >
                        <Text
                            className="font-sora"
                            fontWeight={'600'}
                            fontSize={'16px'}
                            color="White"
                            alignSelf={'center'}
                        >
                            Sell on Hamza
                        </Text>
                    </Flex>

                    <Menu placement="bottom-end">
                        <MenuButton
                            width={'115px'}
                            height={'52px'}
                            px="1rem"
                            borderRadius={'full'}
                            justifyContent={'center'}
                            alignSelf={'center'}
                            marginLeft={'1rem'}
                            backgroundColor={'primary.green.900'}
                            cursor={'pointer'}
                        >
                            <Flex>
                                <Flex alignSelf={'center'}>
                                    <IoMdMenu color="black" size={30} />
                                </Flex>
                                <Flex marginLeft={'auto'} alignSelf={'center'}>
                                    <CgProfile color="black" size={30} />
                                </Flex>
                            </Flex>
                        </MenuButton>
                        <MenuList
                            marginTop={'1rem'}
                            backgroundColor={'black'}
                            width={'321px'}
                        >
                            <MenuItem backgroundColor={'black'} color={'white'}>
                                Sell on Hamza
                            </MenuItem>
                            <MenuItem backgroundColor={'black'} color={'white'}>
                                Be an affiliate
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem backgroundColor={'black'} color={'white'}>
                                Market
                            </MenuItem>
                            <MenuItem backgroundColor={'black'} color={'white'}>
                                About Us
                            </MenuItem>
                            <MenuItem backgroundColor={'black'} color={'white'}>
                                Help Center
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem
                                height={'100%'}
                                backgroundColor={'primary.green.900'}
                                color={'black'}
                                justifyContent={'center'}
                            >
                                Connect Wallet
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>
        </Flex>
    );
}
