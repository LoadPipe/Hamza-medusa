'use server';

import React from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { Flex } from '@chakra-ui/react';
import Image from 'next/image';
// Images
import HamzaLogo from '../../../../../public/images/logo/logo_green.svg';
import HamzaTitle from '../../../../../public/images/logo/hamza-title.svg';
import HamzaTitle2 from '../../../../../public/images/logo/nav-logo.svg';
//  Components
import { WalletConnectButton } from './connect-button/components/connect-button';
import NavSearchBar from './components/nav-searchbar';
import MobileMenu from './components/mobile-menu';
import MobileNav from './components/mobile-nav';
import MainMenu from './menu/main-menu';
import ConnectWallet from './connect-button';

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

                    <MainMenu />

                    <ConnectWallet />
                </Flex>
            </Flex>
        </Flex>
    );
}
