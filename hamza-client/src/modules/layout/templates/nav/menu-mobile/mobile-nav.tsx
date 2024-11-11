import React from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { Flex, Text } from '@chakra-ui/react';
import Image from 'next/image';
import HamzaLogo from '../../../../../../public/images/logo/logo_green.svg';
import HamzaBetaTitle from '@/images/logo/hamza-title-beta.svg';
import HamzaLogo from '../../../../../../public/images/logo/hamza-beta.png';
import MobileMainMenu from './menu/mobile-main-menu';
import { WalletConnectButton } from './connect-wallet/connect-button';
import CartButtonMobile from './components/cart-button';

export default async function MobileNav() {
    return (
        <Flex
            h={'87px'}
            mr="1rem"
            maxWidth={'1280px'}
            width={'100%'}
            bgColor={'transparent'}
            display={{ base: 'flex', md: 'none' }}
            justifyContent={'space-between'}
            alignItems="center"
        >
            <Flex width={'100%'} justifyContent={'center'} alignItems="center">
                <Flex flex={1}>
                    <MobileMainMenu />
                </Flex>
                <Flex flex={1} justifyContent={'center'}>
                    <LocalizedClientLink href="/">
                        <Flex>
                            <Image
                                className="w-[22.92px] h-[33px] md:w-[47.34px] md:h-[67px]"
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
                    <Flex ml="auto">
                        <WalletConnectButton />
                    </Flex>
                    <CartButtonMobile />
                </Flex>
            </Flex>
        </Flex>
    );
}
