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
} from '@chakra-ui/react';

import { IoMdMenu } from 'react-icons/io';
import Link from 'next/link';
import NavLink from '../components/nav-link';

import {
    MdOutlinePeople,
    MdOutlineStorefront,
    MdOutlineSell,
    MdOutlineHelpCenter,
    MdOutlineFiberSmartRecord,
    MdOutlineLibraryBooks,
} from 'react-icons/md';
import { FaHome } from 'react-icons/fa';

const MainMenu = () => {
    return (
        <Flex display={{ base: 'none', md: 'flex' }} height={'100%'}>
            <Menu placement="bottom-end">
                <MenuButton
                    width={'44px'}
                    height={'44px'}
                    px="0.5rem"
                    borderRadius={'full'}
                    borderColor={'white'}
                    borderWidth={'2px'}
                    backgroundColor={'transparent'}
                    cursor={'pointer'}
                    _hover={{
                        '.menu-icon': {
                            color: 'primary.green.900',
                            transition: 'color 0.3s ease-in-out',
                        },
                        borderColor: 'primary.green.900',
                        transition: 'border-color 0.3s ease-in-out',
                    }}
                >
                    <Flex
                        className="menu-icon"
                        alignSelf={'center'}
                        color={'white'}
                    >
                        <IoMdMenu size={40} />
                    </Flex>
                </MenuButton>
                <MenuList
                    marginTop={'1rem'}
                    pb={'0px'}
                    borderRadius={'16px'}
                    borderColor={{
                        base: 'transparent',
                        md: 'white',
                    }}
                    backgroundColor={'black'}
                    width={{ base: '100vw', md: '321px' }}
                >
                    <NavLink href={`/`}>
                        <MenuItem
                            fontWeight={'600'}
                            mt="1rem"
                            pl="1rem"
                            color={'white'}
                            backgroundColor={'black'}
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
                            pl="1rem"
                            color={'white'}
                            backgroundColor={'black'}
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

                    <a target="_blank" href="https://blog.hamza.market/blog/">
                        <MenuItem
                            fontWeight={'600'}
                            pl="1rem"
                            color={'white'}
                            backgroundColor={'black'}
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
                            pl="1rem"
                            color={'white'}
                            backgroundColor={'black'}
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
                            pl="1rem"
                            mb="1rem"
                            color={'white'}
                            backgroundColor={'black'}
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

                    <Box px={{ base: '2rem', md: 0 }}>
                        <MenuDivider
                            opacity={{ base: '0.5', md: '1' }}
                            borderColor={'white'}
                        />
                    </Box>
                    <Link
                        href={`https://blog.hamza.market/request-product/`}
                        target="_blank"
                    >
                        <MenuItem
                            fontWeight={'600'}
                            mt="0.5rem"
                            pl="1rem"
                            color={'white'}
                            backgroundColor={'black'}
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
                            mt="0.5rem"
                            pl="1rem"
                            color={'white'}
                            backgroundColor={'black'}
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
                            mb="1rem"
                            pl="1rem"
                            color={'white'}
                            backgroundColor={'black'}
                            _hover={{ color: 'primary.green.900' }}
                        >
                            <Flex
                                w="30px"
                                alignItems={'center'}
                                justifyContent={'center'}
                            >
                                <MdOutlinePeople size={30} />
                            </Flex>
                            <Text ml="0.5rem">Be an affiliate</Text>
                        </MenuItem>
                    </Link>
                </MenuList>
            </Menu>
        </Flex>
    );
};

export default MainMenu;
