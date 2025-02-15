'use server';

import React from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { Box, Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
// Images
//import HamzaLogo from '../../../../../public/images/logo/logo_green.svg';
//import HamzaTitle from '../../../../../public/images/logo/hamza-title.svg';
//import HamzaTitle2 from '../../../../../public/images/logo/nav-logo.svg';
import HamzaLogo from '../../../../../public/images/logo/hamza-beta.png';
import HamzaHoliday from '@/images/logo/hamza-holiday.svg';
//  Components
import HnsDisplay from './menu-desktop/hns-display/index';
import NavSearchBar from './menu-desktop/components/nav-searchbar';
import MobileMenu from './menu-mobile/menu/mobile-main-menu';
import MobileNav from './menu-mobile/mobile-nav';
import MainMenu from './menu-desktop/main-menu';
import { WalletConnectButton } from './menu-desktop/connect-wallet';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import { LineItem } from '@medusajs/medusa';
import { headers } from 'next/headers';
import MobileNavContainer from './mobile-nav-container';

const fetchCart = async () => {
    const cart = await retrieveCart();

    if (cart?.items?.length) {
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
        <MobileNavContainer cart={cart}>
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
                    <Flex width={'100%'} alignItems="center" gap={'18px'}>
                        <LocalizedClientLink href="/">
                            <Flex
                                width={'190px'}
                                height={'80px'}
                                marginLeft="auto"
                                flexShrink={0}
                            >
                                <Image
                                    style={{
                                        alignSelf: 'left',
                                    }}
                                    src={HamzaLogo}
                                    alt="Hamza"
                                />
                            </Flex>
                        </LocalizedClientLink>

                        <NavSearchBar />

                        <Box ml={'auto'}>
                            <WalletConnectButton />
                        </Box>

                        <Flex flexDirection={'row'} alignItems={'center'}>
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
        </MobileNavContainer>
    );
}
