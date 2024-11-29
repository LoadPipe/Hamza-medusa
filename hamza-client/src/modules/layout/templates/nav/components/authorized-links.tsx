'use client';
import React from 'react';
import { Text, Box, MenuItem, MenuDivider } from '@chakra-ui/react';
import NavLink from './nav-link';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';

const AuthorizedLinks = () => {
    const { authData } = useCustomerAuthStore();
    return (
        <>
            {authData.status === 'authenticated' && (
                <>
                    <NavLink href={`/account/profile`}>
                        <MenuItem
                            fontWeight={'600'}
                            mt="1rem"
                            px="2rem"
                            color={'white'}
                            backgroundColor={'black'}
                            _hover={{
                                color: 'primary.green.900',
                            }}
                        >
                            <Text>Account</Text>
                        </MenuItem>
                    </NavLink>

                    {authData.is_verified == false && (
                        <NavLink href={`/account/verify`}>
                            <MenuItem
                                fontWeight={'600'}
                                px="2rem"
                                color={'white'}
                                backgroundColor={'black'}
                                _hover={{
                                    color: 'primary.green.900',
                                }}
                            >
                                <Text>Verify Account</Text>
                            </MenuItem>
                        </NavLink>
                    )}

                    <Box px={{ base: '2rem', md: 0 }}>
                        <MenuDivider
                            opacity={{ base: '0.5', md: '1' }}
                            borderColor={'white'}
                        />
                    </Box>
                </>
            )}
        </>
    );
};

export default AuthorizedLinks;
