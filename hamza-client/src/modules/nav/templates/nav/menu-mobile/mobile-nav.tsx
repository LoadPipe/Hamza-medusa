import React from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import HamzaLogo from '../../../../../../public/images/logo/logo_green.svg';
import HamzaBetaTitle from '@/images/logo/hamza-title-beta.svg';
import MobileMainMenu from './menu/mobile-main-menu';
import { WalletConnectButton } from './connect-wallet/connect-button';
import NavProfileCurrency from '@modules/nav/components/nav-profile-currency';
import CartButtonMobile from './components/cart-button';

export default async function MobileNav() {
    return (
        <Flex
            h={'87px'}
            mr="1rem"
            maxWidth={'1280px'}
            width={'100%'}
            bgColor={'transparent'}
            className="mobile-nav"
            display={{ base: 'flex', md: 'none' }}
            justifyContent={'space-between'}
            alignItems="center"
            px="20px"
            py="10px"
        >
            <Flex width={'100%'} justifyContent={'center'} alignItems="center">
                <Flex flex={1} justifyContent={'left'}>
                    <LocalizedClientLink href="/">
                        <Flex>
                            <Image
                                className="w-[20px] h-[30px]"
                                src={HamzaLogo}
                                alt="Hamza"
                            />

                            <Image
                                src={HamzaBetaTitle}
                                className="w-[64.73px] h-[15.59px]"
                                style={{
                                    alignSelf: 'center',
                                }}
                                alt="Hamza"
                            />
                        </Flex>
                    </LocalizedClientLink>
                </Flex>

                <Flex flex={1}>
                    <Flex ml="auto" alignItems={'center'} gap={'0px'}>
                        <NavProfileCurrency iconOnly={true} />
                        <WalletConnectButton />
                        <CartButtonMobile />
                    </Flex>
                </Flex>
                <Flex>
                    <MobileMainMenu />
                </Flex>
            </Flex>
        </Flex>
    );
}
