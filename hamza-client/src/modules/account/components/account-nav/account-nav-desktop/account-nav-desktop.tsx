'use client';
import { CgProfile } from 'react-icons/cg';
import { LiaBoxOpenSolid } from 'react-icons/lia';
import { FaRegHeart, FaRegBell } from 'react-icons/fa';
import { PiNotePencilLight } from 'react-icons/pi';
import { CiLogout } from 'react-icons/ci';

import { Customer } from '@medusajs/medusa';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { MdOutlineRateReview } from 'react-icons/md';

import { Flex, Box, Text, IconButton, Collapse } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useOrderTabStore } from '@store/order-tab-state';

import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import NavLink from '../components/nav-link';
import NavLinkOrders from '../components/nav-link-desktop-orders';
import { TABS } from 'modules/order-tab-management';
import { RiShoppingBasket2Line } from 'react-icons/ri';

const AccountNavDesktop = ({
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
        <Flex flexDirection={'column'} style={{ width: '300px' }}>
            <Flex
                borderRadius={'8px'}
                height={'56px'}
                padding="16px"
                alignItems={'center'}
                justifyContent="space-between"
                color="white"
                onClick={toggleCollapse}
                cursor="pointer"
            >
                <Flex justifyContent={'center'} alignContent={'center'}>
                    <Flex width={'26px'} height={'26px'}>
                        <CgProfile
                            color="white"
                            size={'24px'}
                            style={{ alignSelf: 'center', margin: '0 auto' }}
                        />
                    </Flex>
                    <Text ml={2} my="auto" fontSize={'18px'} fontWeight={600}>
                        Manage My Account
                    </Text>
                </Flex>

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
                    icon={
                        <MdOutlineRateReview
                            size="24px"
                            style={{ alignSelf: 'center', margin: '0 auto' }}
                        />
                    }
                />
            )}

            {/*{authData.is_verified && (*/}
            <Flex
                borderRadius="8px"
                height="56px"
                padding="12px 16px"
                alignItems="center"
                justifyContent="space-between"
                color="white"
                backgroundColor={'transparent'}
                cursor="pointer"
                onClick={toggleOrdersCollapse} // Toggle collapse when the whole Flex container is clicked
            >
                <Flex width={'26px'} height={'26px'}>
                    <RiShoppingBasket2Line
                        color="white"
                        size={'26px'}
                        style={{ alignSelf: 'center', margin: '0 auto' }}
                    />
                </Flex>
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
                    <Text
                        ml={2}
                        fontSize={'18px'}
                        fontWeight={600}
                        color="white"
                    >
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
            {/*)}*/}

            {/* Collapsible Panel for Orders */}
            <Collapse in={isOrdersOpen} animateOpacity>
                <Box mt={2} pl={4}>
                    <NavLinkOrders
                        href={'/account/orders'}
                        route={route!}
                        title="All Orders"
                        tab={'All Orders'}
                        handleTabChange={() => handleTabChange(TABS.ALL)}
                    />
                    <NavLinkOrders
                        href={'/account/orders'}
                        route={route!}
                        title="Processing"
                        tab={'Processing'}
                        handleTabChange={() => handleTabChange(TABS.PROCESSING)}
                    />
                    <NavLinkOrders
                        href={'/account/orders'}
                        route={route!}
                        title="Shipped"
                        tab={'Shipped'}
                        handleTabChange={() => handleTabChange(TABS.SHIPPED)}
                    />
                    <NavLinkOrders
                        href={'/account/orders'}
                        route={route!}
                        title="Delivered"
                        tab={'Delivered'}
                        handleTabChange={() => handleTabChange(TABS.DELIVERED)}
                    />
                    <NavLinkOrders
                        href={'/account/orders'}
                        route={route!}
                        title="Cancelled"
                        tab={'Cancelled'}
                        handleTabChange={() => handleTabChange(TABS.CANCELLED)}
                    />
                    <NavLinkOrders
                        href={'/account/orders'}
                        route={route!}
                        title="Refund"
                        tab={'Refund'}
                        handleTabChange={() => handleTabChange(TABS.REFUND)}
                    />
                </Box>
            </Collapse>

            {/* Wishlist */}

            <Box>
                <NavLink
                    href="/account/wishlist"
                    route={route!}
                    title="Wishlist"
                    icon={
                        <FaRegHeart
                            size="24px"
                            style={{ alignSelf: 'center', margin: '0 auto' }}
                        />
                    }
                />
            </Box>

            {authData.is_verified && (
                <NavLink
                    href="/account/notifications"
                    route={route!}
                    title="Notifications"
                    icon={
                        <FaRegBell
                            size="24px"
                            style={{ alignSelf: 'center', margin: '0 auto' }}
                        />
                    }
                />
            )}

            {authData.is_verified && (
                <NavLink
                    href="/account/reviews"
                    route={route!}
                    title={'Reviews'}
                    icon={
                        <PiNotePencilLight
                            size={'24px'}
                            style={{ alignSelf: 'center', margin: '0 auto' }}
                        />
                    }
                />
            )}

            <Box
                as="button"
                borderRadius={'8px'}
                height={'56px'}
                padding="16px"
                bg="transparent"
                color="white"
                _active={{
                    bg: 'primary.green.900',
                    color: 'black',
                    transform: 'scale(0.98)',
                    borderColor: '#bec3c9',
                }}
                onClick={handleLogout}
            >
                <Flex>
                    <Flex width={'26px'} height={'26px'}>
                        <CiLogout
                            color="white"
                            size={'24px'}
                            style={{ alignSelf: 'center', margin: '0 auto' }}
                        />
                    </Flex>

                    <Text ml={2} my="auto" fontSize={'18px'} fontWeight={600}>
                        Logout
                    </Text>
                </Flex>
            </Box>
        </Flex>
    );
};

export default AccountNavDesktop;
