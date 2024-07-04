import React from 'react';
import CartButton from '@modules/layout/components/cart-button';
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
import Image from 'next/image';
import { IoMdMenu } from 'react-icons/io';
import Link from 'next/link';
import NavLink from '../components/nav-link';
import { CgProfile } from 'react-icons/cg';
import AuthorizedLinks from '../components/authorized-links';
import ConnectWalletLink from '../components/connect-wallet-link';
import { AiOutlineMenu } from 'react-icons/ai';

// import filterImage from '../../../../../../public/images/buttons/filter-16px.svg'

export default function MobileMenu() {
    return (
        <Flex display={{ sm: 'flex', md: 'none' }} mr="auto">
            <Menu placement="bottom-start">
                <MenuButton
                    flexShrink={0}
                    width={{ base: '60px' }}
                    height={{ base: '60px' }}
                    px="1rem"
                    borderRadius={{ base: 'none' }}
                    cursor={'pointer'}
                >
                    <Flex color={'primary.green.900'}>
                        <AiOutlineMenu size={'20px'} />
                    </Flex>
                </MenuButton>
                <MenuList
                    mt="-1rem"
                    pb={'0px'}
                    borderTopRadius={'0px'}
                    borderBottomRadius={'16px'}
                    borderColor={{ base: 'transparent', md: 'white' }}
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

                    <a target="_blank" href="https://blog.hamza.biz/about/">
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

                    <a target="_blank" href="https://blog.hamza.biz/contact/">
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
    );
}
