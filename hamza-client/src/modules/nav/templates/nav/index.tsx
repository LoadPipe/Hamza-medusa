'use server';

import React from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react';
import Image from 'next/image';
// Images
//import HamzaLogo from '../../../../../public/images/logo/logo_green.svg';
//import HamzaTitle from '../../../../../public/images/logo/hamza-title.svg';
//import HamzaTitle2 from '../../../../../public/images/logo/nav-logo.svg';
import HamzaLogo from '../../../../../public/images/logo/logo.png';
//  Components
import MobileNav from './menu-mobile/mobile-nav';
import { WalletConnectButton } from './menu-desktop/connect-wallet';
import NavProfileCurrency from '@modules/nav/components/nav-profile-currency';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import { LineItem } from '@medusajs/medusa';
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
                className="sticky top-0 desktop-nav"
                width="100%"
                height={{ base: '60px', md: '125px' }}
                justifyContent={'center'}
                alignItems={'center'}
                backgroundColor={'#020202'}
            >
                <MobileNav cart={cart} />

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
                            <HStack
                                height={'71px'}
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
                                <Box
                                    fontSize={'13px'}
                                    fontWeight={'bold'}
                                    color={'white'}
                                    ml={'10px'}
                                >
                                    BUY & SELL PRODUCTS USING{' '}
                                    <span style={{ color: '#94D42A' }}>
                                        CRYPTO!
                                    </span>
                                </Box>
                            </HStack>
                        </LocalizedClientLink>

                        <Flex ml={'auto'} alignItems={'center'} gap={'12px'}>
                            <NavProfileCurrency />
                            <LocalizedClientLink href="/start-selling">
                                <Button
                                    borderRadius="30px"
                                    backgroundColor="transparent"
                                    border="2px solid"
                                    borderColor="primary.green.900"
                                    color="primary.green.900"
                                    height="48px"
                                    fontSize="16px"
                                    _hover={{
                                        backgroundColor: "primary.green.900",
                                        color: "white"
                                    }}
                                >
                                    Become a Seller
                                </Button>
                            </LocalizedClientLink>
                            <WalletConnectButton />
                        </Flex>

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
                                                <Text
                                                    fontSize={'10px'}
                                                    className="cart-quantity"
                                                >
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
