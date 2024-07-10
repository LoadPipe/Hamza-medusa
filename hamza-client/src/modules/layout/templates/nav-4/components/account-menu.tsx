'use client';
import React from 'react';
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
import Link from 'next/link';
import { CgProfile } from 'react-icons/cg';
import { MdOutlinePersonOutline } from 'react-icons/md';
import { AiFillSetting } from 'react-icons/ai';

const AccountMenu = () => {
    return (
        <Flex display={{ base: 'none', md: 'flex' }} height={'100%'}>
            <Menu placement="bottom-end">
                <MenuButton
                    width={'60px'}
                    height={'57px'}
                    px="1rem"
                    borderRadius={'full'}
                    borderColor={'white'}
                    borderWidth={'1px'}
                    backgroundColor={'transparent'}
                    cursor={'pointer'}
                >
                    <Flex alignSelf={'center'} color={'white'}>
                        <CgProfile size={30} />
                    </Flex>
                </MenuButton>
                <MenuList
                    marginTop={'1rem'}
                    pb={'0px'}
                    borderTopRadius={'0px'}
                    borderBottomRadius={'16px'}
                    borderColor={{
                        base: 'transparent',
                        md: 'white',
                    }}
                    backgroundColor={'black'}
                    width={{ base: '100vw', md: '321px' }}
                >
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
                            <Flex
                                w={'30px'}
                                alignContent={'center'}
                                justifyContent={'center'}
                            >
                                <MdOutlinePersonOutline size={30} />
                            </Flex>
                            <Text fontWeight={'600'} ml="0.5rem">
                                Profile
                            </Text>
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
                            <Flex
                                w={'30px'}
                                alignContent={'center'}
                                justifyContent={'center'}
                            >
                                <AiFillSetting size={26} />
                            </Flex>
                            <Text fontWeight={'600'} ml="0.5rem">
                                {' '}
                                Settings
                            </Text>
                        </MenuItem>
                    </Link>
                    <Box px={{ base: '2rem', md: 0 }}>
                        <MenuDivider
                            opacity={{ base: '0.5', md: '1' }}
                            borderColor={'white'}
                        />
                    </Box>

                    {/* <ConnectWalletLink /> */}
                </MenuList>
            </Menu>
        </Flex>
    );
};

export default AccountMenu;
