'use server';

import React from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
// Images
import HamzaLogo from '../../../../../public/images/logo/logo_green.svg';
import HamzaTitle from '../../../../../public/images/logo/hamza-title.svg';
import HamzaTitle2 from '../../../../../public/images/logo/nav-logo.svg';
//  Components
import { WalletConnectButton } from './connect-button/components/connect-button';
import NavSearchBar from './components/nav-searchbar';
import MobileMenu from './menu/mobile-menu';
import MobileNav from './components/mobile-nav';
import MainMenu from './menu/main-menu';
import ConnectWallet from './connect-button';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import { LineItem } from '@medusajs/medusa';

const fetchCart = async () => {
    const cart = await retrieveCart();

    if (cart?.items.length) {
        const enrichedItems = await enrichLineItems(
            cart?.items,
            cart?.region_id
        );
        cart.items = enrichedItems as LineItem[];
    }

    return cart;
};

export default async function Nav() {
    const cart = await fetchCart();

    const totalItems =
        cart?.items?.reduce((acc: any, item: any) => {
            return acc + item.quantity;
        }, 0) || 0;

    return (
        <Flex
            userSelect={'none'}
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
                                className="w-[22.92px] h-[33px] md:w-[49px] md:h-[71px]"
                                style={{
                                    alignSelf: 'center',
                                }}
                                src={HamzaLogo}
                                alt="Hamza"
                            />

                            <Image
                                src={HamzaTitle2}
                                className="w-[60.73px] h-[11.59px] md:w-[125.42px] md:h-[106px] ml-[0.5rem] md:ml-[1rem]"
                                style={{
                                    alignSelf: 'center',
                                }}
                                alt="Hamza"
                            />
                        </Flex>
                    </LocalizedClientLink>

                    <NavSearchBar />

                    <ConnectWallet />

                    <Flex ml="1rem">
                        <MainMenu />
                    </Flex>

                    <Flex ml="1rem" flexDirection={'row'} alignItems={'center'}>
                        <Flex alignSelf={'center'}>
                            <LocalizedClientLink href="/cart">
                                <Flex
                                    position="relative"
                                    width={'100%'}
                                    color="white"
                                    _hover={{
                                        '.cart-text, .cart-icon': {
                                            color: 'primary.green.900',
                                        },
                                    }}
                                >
                                    <Flex
                                        flexDirection={'row'}
                                        alignSelf={'center'}
                                        color={'white'}
                                        _hover={{
                                            '.cart-icon': {
                                                color: 'primary.green.900',
                                                transition:
                                                    'color 0.3s ease-in-out',
                                            },
                                        }}
                                    >
                                        <HiOutlineShoppingCart
                                            className="cart-icon"
                                            size={'40px'}
                                        />
                                    </Flex>
                                    {totalItems > 0 && (
                                        <Flex
                                            position="absolute"
                                            top="-4px"
                                            right="-4px"
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
                                            <Text fontSize={'10px'}>
                                                {totalItems}
                                            </Text>
                                        </Flex>
                                    )}
                                </Flex>
                            </LocalizedClientLink>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}
