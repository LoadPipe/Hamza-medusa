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

import { GiHamburgerMenu } from 'react-icons/gi';
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

export default function ProductDetailsMobileMenu() {
    return (
        <Menu placement="top-end">
            <MenuButton
                borderRadius={'full'}
                borderColor={'transparent'}
                borderWidth={'1px'}
                width={'100%'}
                height={'100%'}
                cursor={'pointer'}
            >
                <Flex
                    className="menu-icon"
                    alignSelf={'center'}
                    justifyContent={'center'}
                    color={'white'}
                >
                    <BsThreeDotsVertical size={16} />
                </Flex>
            </MenuButton>

            <Portal>
                <MenuList
                    mt="1rem"
                    borderRadius={'16px'}
                    borderColor={'#555555'}
                    borderWidth={'1px'}
                    backgroundColor={'#121212'}
                >
                    <Link
                        href={`https://blog.hamza.biz/merchant/`}
                        target="_blank"
                    >
                        <MenuItem
                            fontWeight={'600'}
                            mt="1rem"
                            px="2rem"
                            color={'white'}
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
                            <Flex
                                w="30px"
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <MdOutlinePeople size={30} />
                            </Flex>
                            <Text ml="0.5rem">Be an affiliate</Text>
                        </MenuItem>
                    </Link>
                    <Box>
                        <MenuDivider opacity={'0.5'} borderColor={'white'} />
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
                            <Flex
                                w="30px"
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <FaHome size={25} />
                            </Flex>
                            <Text ml="0.5rem">Home</Text>
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
                            <Flex
                                w="30px"
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                <MdOutlineSell size={25} />
                            </Flex>
                            <Text ml="0.5rem">Shop</Text>
                        </MenuItem>
                    </NavLink>

                    <a target="_blank" href="https://blog.hamza.biz/blog/">
                        <MenuItem
                            fontWeight={'600'}
                            px="2rem"
                            color={'white'}
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

                    <a target="_blank" href="https://blog.hamza.biz/about/">
                        <MenuItem
                            fontWeight={'600'}
                            px="2rem"
                            color={'white'}
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
                            px="2rem"
                            mb="1.5rem"
                            color={'white'}
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

                    <MenuDivider
                        display={{ base: 'none', md: 'flex' }}
                        mb="0"
                        opacity={'1'}
                        borderColor={'white'}
                    />
                </MenuList>
            </Portal>
        </Menu>
    );
}
