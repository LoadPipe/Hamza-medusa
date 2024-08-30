'use client';

import { Customer } from '@medusajs/medusa';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { Flex, Box, Text, IconButton, Collapse } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useOrderTabStore } from '@store/order-tab-state';

import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import NavLink from './components/nav-link';
import { TABS } from 'modules/order-tab-management';
const AccountNav = ({
    customer,
}: {
    customer: Omit<Customer, 'password_hash'> | null;
}) => {
    const route = usePathname();
    const searchParams = useSearchParams();
    const { countryCode } = useParams();
    const { setCustomerAuthData, authData } = useCustomerAuthStore();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);

    const handleLogout = async () => {
        setCustomerAuthData({
            customer_id: '',
            is_verified: false,
            token: '',
            wallet_address: '',
            status: 'unauthenticated',
        });
        Cookies.remove('_medusa_jwt');
        Cookies.remove('_medusa_cart_id');
        router.replace('/');
    };

    const toggleCollapse = () => setIsOpen(!isOpen);
    const toggleOrdersCollapse = () => setIsOrdersOpen(!isOrdersOpen);
    const setOrderActiveTab = useOrderTabStore(
        (state) => state.setOrderActiveTab
    );
    const handleTabChange = (tab: any) => {
        setOrderActiveTab(tab);
        // navigate to OrderOverview or update the URL to reflect the active tab
    };

    useEffect(() => {
        if (searchParams.get('verify') === 'true') {
            setCustomerAuthData({
                ...authData,
                is_verified: true,
            });
        } else {
            if (
                searchParams.get('verify') === 'false' &&
                searchParams.get('error') === 'true'
            ) {
                router.push(`/${countryCode}/verify-email?auth_error=true`);
            }
        }
    }, []);
    useEffect(() => {
        if (
            route == `/${countryCode}/account` &&
            !authData.is_verified &&
            !searchParams.get('verify')
        ) {
            router.push(`/${countryCode}/account/profile`);
        }
    }, [authData.is_verified]);

    return (
        <Flex style={{ width: '245px' }}>
            <Flex flexDirection={'column'} width={'245px'}>
                <Flex
                    borderRadius={'8px'}
                    width={'245px'}
                    height={'56px'}
                    padding="16px"
                    my={'8'}
                    alignItems={'center'}
                    justifyContent="space-between"
                    color="white"
                    onClick={toggleCollapse}
                    cursor="pointer"
                >
                    <Text my="auto" fontSize={'18px'} fontWeight={600}>
                        Manage My Account
                    </Text>
                    <IconButton
                        aria-label="Toggle Collapse"
                        icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        variant="ghost"
                        color="white"
                    />
                </Flex>

                {/* Collapsible Panel */}
                <Collapse in={isOpen} animateOpacity>
                    <Box mt={2} pl={4}>
                        <NavLink
                            href="/account/profile"
                            route={route!}
                            title="My Profile"
                        />
                        <NavLink
                            href="/account/addresses"
                            route={route!}
                            title="My Addresses"
                        />
                    </Box>
                </Collapse>

                {!authData.is_verified && (
                    <NavLink
                        href="/account/verify"
                        route={route!}
                        title={'Verify'}
                    />
                )}

                <Flex
                    borderRadius="8px"
                    width="245px"
                    height="56px"
                    padding="12px 16px"
                    alignItems="center"
                    justifyContent="space-between"
                    color="white"
                    backgroundColor={'transparent'}
                    mt="4"
                    cursor="pointer"
                    onClick={toggleOrdersCollapse} // Toggle collapse when the whole Flex container is clicked
                >
                    <Flex
                        as={NextLink}
                        href="/account/orders"
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                        backgroundColor={'transparent'}
                        textDecoration="none"
                        _hover={{ textDecoration: 'none' }} // Remove underline on hover
                    >
                        <Text fontSize={'18px'} fontWeight={600} color="white">
                            Orders
                        </Text>
                        <IconButton
                            aria-label="Toggle Collapse"
                            icon={
                                isOrdersOpen ? (
                                    <ChevronUpIcon />
                                ) : (
                                    <ChevronDownIcon />
                                )
                            }
                            variant="ghost"
                            color="white"
                            size="sm" // Adjust icon button size for better alignment
                            onClick={toggleOrdersCollapse} // Toggle collapse when the Chevron icon is clicked
                        />
                    </Flex>
                </Flex>

                {/* Collapsible Panel for Orders */}
                <Collapse in={isOrdersOpen} animateOpacity>
                    <Box mt={2} pl={4}>
                        <Box
                            as="button"
                            textAlign="left"
                            width="100%"
                            py={2} // Add padding for better click area
                            color="white"
                            bg="transparent"
                            _hover={{ color: 'primary.green.900' }} // Update hover color to primary.green.900
                            onClick={() => handleTabChange(TABS.ALL)}
                        >
                            All Orders
                        </Box>
                        <Box
                            as="button"
                            textAlign="left"
                            width="100%"
                            py={2}
                            mt={1} // Ensure consistent spacing
                            color="white"
                            bg="transparent"
                            _hover={{ color: 'primary.green.900' }}
                            onClick={() => handleTabChange(TABS.PROCESSING)}
                        >
                            Processing
                        </Box>
                        <Box
                            as="button"
                            textAlign="left"
                            width="100%"
                            py={2}
                            mt={1}
                            color="white"
                            bg="transparent"
                            _hover={{ color: 'primary.green.900' }}
                            onClick={() => handleTabChange(TABS.SHIPPED)}
                        >
                            Shipped
                        </Box>
                        <Box
                            as="button"
                            textAlign="left"
                            width="100%"
                            py={2}
                            mt={1}
                            color="white"
                            bg="transparent"
                            _hover={{ color: 'primary.green.900' }}
                            onClick={() => handleTabChange(TABS.DELIVERED)}
                        >
                            Delivered
                        </Box>
                        <Box
                            as="button"
                            textAlign="left"
                            width="100%"
                            py={2}
                            mt={1}
                            color="white"
                            bg="transparent"
                            _hover={{ color: 'primary.green.900' }}
                            onClick={() => handleTabChange(TABS.CANCELLED)}
                        >
                            Cancelled
                        </Box>
                        <Box
                            as="button"
                            textAlign="left"
                            width="100%"
                            py={2}
                            mt={1}
                            color="white"
                            bg="transparent"
                            _hover={{ color: 'primary.green.900' }}
                            onClick={() => handleTabChange(TABS.REFUND)}
                        >
                            Refund
                        </Box>
                    </Box>
                </Collapse>

                {authData.is_verified && (
                    <NavLink
                        href="/account/notifications"
                        route={route!}
                        title={'Notifications'}
                    />
                )}
                {authData.is_verified && (
                    <NavLink
                        href="/account/reviews"
                        route={route!}
                        title={'Reviews'}
                    />
                )}
                <Box
                    as="button"
                    textAlign={'left'}
                    borderRadius={'8px'}
                    width={'245px'}
                    height={'56px'}
                    padding="16px"
                    bg="transparent"
                    borderColor="#ccd0d5"
                    color="white"
                    _active={{
                        bg: 'primary.green.900',
                        color: 'black',
                        transform: 'scale(0.98)',
                        borderColor: '#bec3c9',
                    }}
                    onClick={handleLogout}
                >
                    <Text my="auto" fontSize={'18px'} fontWeight={600}>
                        Logout
                    </Text>
                </Box>
            </Flex>
        </Flex>
    );
};

export default AccountNav;
