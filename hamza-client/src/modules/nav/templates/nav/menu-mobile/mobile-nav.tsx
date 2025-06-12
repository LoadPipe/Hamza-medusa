'use client';

import React, { useState } from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { Flex } from '@chakra-ui/react';
import Image from 'next/image';
import HamzaLogo from '../../../../../../public/images/logo/logo_green.svg';
import HamzaBetaTitle from '@/images/logo/hamza-title-beta.svg';
import MobileMainMenu from './menu/mobile-main-menu';
import { WalletConnectButton } from './connect-wallet/connect-button';
import NavProfileCurrency from '@modules/nav/components/nav-profile-currency';
import SearchButtonMobile from './components/search-button';
import CartButtonMobile from './components/cart-button';
import MobileSearchModal from '@modules/search/templates/mobile-search-modal';
import { Cart } from '@medusajs/medusa';

interface MobileNavProps {
    cart?: Cart;
}

export default function MobileNav({ cart }: MobileNavProps) {
    const [searchOpened, setSearchOpened] = useState(false);
    return (
        <Flex
            h={'87px'}
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
                      
                        <SearchButtonMobile
                            onClick={() => setSearchOpened(true)}
                        />
                        <WalletConnectButton />
                        <CartButtonMobile cart={cart} />
                    </Flex>
                </Flex>
                <Flex>
                    <MobileMainMenu />
                </Flex>
            </Flex>

            {searchOpened && (
                <MobileSearchModal closeModal={() => setSearchOpened(false)} />
            )}
        </Flex>
    );
}
