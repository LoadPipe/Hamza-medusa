import React from 'react';
import {
    Flex,
    Text,
    Box,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Portal,
} from '@chakra-ui/react';
import Link from 'next/link';
import NavLink from '@modules/layout/templates/nav/components/nav-link';

import {
    MdOutlinePeople,
    MdOutlineStorefront,
    MdOutlineSell,
    MdOutlineHelpCenter,
    MdOutlineFiberSmartRecord,
    MdOutlineLibraryBooks,
} from 'react-icons/md';
import { FaHome } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RxHamburgerMenu } from 'react-icons/rx';

export default function ProductDetailsMobileMenu() {
    return (
        <Menu placement="bottom">
            <MenuButton
                borderRadius={'full'}
                borderColor={'transparent'}
                borderWidth={'1px'}
                backgroundColor={'#3E3E3E80'}
                cursor={'pointer'}
                height={'32px'}
                width={'32px'}
            >
                <Flex
                    className="menu-icon"
                    alignSelf={'center'}
                    justifyContent={'center'}
                    color={'white'}
                >
                    <RxHamburgerMenu size={16} />
                </Flex>
            </MenuButton>

            <Portal>
                <MenuList
                    width={'100vw'}
                    px={'1rem'}
                    py={'1.5rem'}
                    borderRadius={'16px'}
                    borderColor={'#555555'}
                    borderWidth={'1px'}
                    backgroundColor={'#121212'}
                >
                    <NavLink href={`/`}>
                        <MenuItem
                            fontWeight={'600'}
                            color={'white'}
                            mb="0.25rem"
                            backgroundColor={'transparent'}
                            _hover={{ color: 'primary.green.900' }}
                        >
                            <FaHome size={25} />
                            <Text ml="0.5rem">Home</Text>
                        </MenuItem>
                    </NavLink>
                    <NavLink href={`/shop`}>
                        <MenuItem
                            fontWeight={'600'}
                            color={'white'}
                            mb="0.25rem"
                            backgroundColor={'transparent'}
                            _hover={{ color: 'primary.green.900' }}
                        >
                            <MdOutlineSell size={25} />
                            <Text ml="0.5rem">Shop</Text>
                        </MenuItem>
                    </NavLink>

                    <a target="_blank" href="https://blog.hamza.market/blog/">
                        <MenuItem
                            fontWeight={'600'}
                            color={'white'}
                            mb="0.25rem"
                            backgroundColor={'transparent'}
                            _hover={{ color: 'primary.green.900' }}
                        >
                            <Flex
                                w="30px"
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <MdOutlineLibraryBooks size={28} />
                            </Flex>
                            <Text ml="0.5rem">Blog</Text>
                        </MenuItem>
                    </a>

                    <a target="_blank" href="https://blog.hamza.market/about/">
                        <MenuItem
                            fontWeight={'600'}
                            color={'white'}
                            mb="0.25rem"
                            backgroundColor={'transparent'}
                            _hover={{ color: 'primary.green.900' }}
                        >
                            <Flex
                                w="30px"
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <MdOutlineFiberSmartRecord size={28} />
                            </Flex>
                            <Text ml="0.5rem">About Us</Text>
                        </MenuItem>
                    </a>

                    <a
                        target="_blank"
                        href="https://support.hamza.market/hc/1568263160"
                    >
                        <MenuItem
                            fontWeight={'600'}
                            color={'white'}
                            mb="0.25rem"
                            backgroundColor={'transparent'}
                            _hover={{ color: 'primary.green.900' }}
                        >
                            <Flex
                                w="30px"
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <MdOutlineHelpCenter size={28} />
                            </Flex>
                            <Text ml="0.5rem">Help Center</Text>
                        </MenuItem>
                    </a>

                    <Box>
                        <MenuDivider opacity={'0.5'} borderColor={'white'} />
                    </Box>
                    <Link
                        href={`https://blog.hamza.market/request-product/`}
                        target="_blank"
                    >
                        <MenuItem
                            fontWeight={'600'}
                            color={'white'}
                            mb="0.25rem"
                            backgroundColor={'transparent'}
                            _hover={{ color: 'primary.green.900' }}
                        >
                            <Flex
                                w="30px"
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <MdOutlineStorefront size={28} />
                            </Flex>
                            <Text ml="0.5rem">Request a Product</Text>
                        </MenuItem>
                    </Link>
                    <Link
                        href={`https://blog.hamza.market/merchant/`}
                        target="_blank"
                    >
                        <MenuItem
                            fontWeight={'600'}
                            color={'white'}
                            mb="0.25rem"
                            backgroundColor={'transparent'}
                            _hover={{ color: 'primary.green.900' }}
                        >
                            <Flex
                                w="30px"
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <MdOutlineStorefront size={28} />
                            </Flex>
                            <Text ml="0.5rem">Sell on Hamza</Text>
                        </MenuItem>
                    </Link>
                    <Link
                        href={`https://blog.hamza.market/affiliate/`}
                        target="_blank"
                    >
                        <MenuItem
                            fontWeight={'600'}
                            color={'white'}
                            backgroundColor={'transparent'}
                            _hover={{ color: 'primary.green.900' }}
                        >
                            <MdOutlinePeople size={30} />
                            <Text ml="0.5rem">Be an affiliate</Text>
                        </MenuItem>
                    </Link>
                </MenuList>
            </Portal>
        </Menu>
    );
}
