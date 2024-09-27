import React from 'react';
// Components
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
import Link from 'next/link';
import NavLink from '../components/nav-link';
import AuthorizedLinks from '../components/authorized-links';
import CartButton from '@modules/layout/components/cart-button';
import Wishlist from '@/components/wishlist';
// Icons
import { AiOutlineMenu } from 'react-icons/ai';
import { GiHamburgerMenu } from 'react-icons/gi';

export default function MobileMenu() {
    return (
        <Menu>
            <MenuButton
                ml={'1rem'}
                width={'24px'}
                height={'24px'}
                borderRadius={'full'}
                borderColor={'white'}
                borderWidth={'1px'}
                justifyContent={'center'}
                alignItems={'center'}
                backgroundColor={'transparent'}
                cursor={'pointer'}
            >
                <Flex
                    className="menu-icon"
                    alignSelf={'center'}
                    justifyContent={'center'}
                    color={'white'}
                >
                    <GiHamburgerMenu size={12} />
                </Flex>
            </MenuButton>

            <MenuList
                mt="1rem"
                borderRadius={'16px'}
                borderColor={'#555555'}
                borderWidth={'1px'}
                backgroundColor={'#121212'}
                width={`calc(100vw - 2rem)`}
            >
                <Link href={`https://blog.hamza.biz/merchant/`} target="_blank">
                    <MenuItem
                        fontWeight={'600'}
                        mt="1rem"
                        px="2rem"
                        color={'white'}
                        backgroundColor={'transparent'}
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
                        backgroundColor={'transparent'}
                        _hover={{ color: 'primary.green.900' }}
                    >
                        Be an affiliate
                    </MenuItem>
                </Link>
                <Box>
                    <MenuDivider
                        opacity={{ base: '0.5', md: '1' }}
                        borderColor={'white'}
                    />
                </Box>

                <NavLink href={`/`}>
                    <MenuItem
                        fontWeight={'600'}
                        mt="1rem"
                        px="2rem"
                        color={'white'}
                        backgroundColor={'transparent'}
                        _hover={{ color: 'primary.green.900' }}
                    >
                        <Text>Home</Text>
                    </MenuItem>
                </NavLink>
                <NavLink href={`/shop`}>
                    <MenuItem
                        fontWeight={'600'}
                        px="2rem"
                        color={'white'}
                        backgroundColor={'transparent'}
                        _hover={{ color: 'primary.green.900' }}
                    >
                        <Text>Shop</Text>
                    </MenuItem>
                </NavLink>

                <a target="_blank" href="https://blog.hamza.biz/about/">
                    <MenuItem
                        fontWeight={'600'}
                        px="2rem"
                        color={'white'}
                        backgroundColor={'transparent'}
                        _hover={{ color: 'primary.green.900' }}
                    >
                        Blog
                    </MenuItem>
                </a>

                <a target="_blank" href="https://blog.hamza.biz/about/">
                    <MenuItem
                        fontWeight={'600'}
                        px="2rem"
                        color={'white'}
                        backgroundColor={'transparent'}
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
                        backgroundColor={'transparent'}
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
            </MenuList>
        </Menu>
    );
}
