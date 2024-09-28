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
import {
    Flex,
    Box,
    Text,
    IconButton,
    Collapse,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Button,
} from '@chakra-ui/react';
import {
    ChevronDownIcon,
    ChevronUpIcon,
    ChevronRightIcon,
} from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useOrderTabStore } from '@store/order-tab-state';

import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import NavLink from '../components/nav-link';
import NavLinkMobile from '../components/nav-link-mobile';

import { TABS } from 'modules/order-tab-management';
const AccountNavMobile = ({
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

    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    const toggleAccountCollapse = () => setIsAccountOpen(!isAccountOpen);
    const toggleOrdersCollapse = () => setIsOrdersOpen(!isOrdersOpen);

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
        <Flex flexDirection={'column'} width={'100%'}>
            <Menu closeOnSelect={false}>
                <MenuButton
                    as={Button}
                    height="56px"
                    backgroundColor={'#121212'}
                    color="primary.green.900"
                    rightIcon={<ChevronDownIcon color="white" />}
                >
                    Manage My Account
                </MenuButton>
                <MenuList
                    color={'white'}
                    width={'calc(100vw - 2rem)'}
                    backgroundColor={'#121212'}
                >
                    {/* Toggle Account Collapse */}
                    <MenuItem
                        onClick={toggleAccountCollapse}
                        backgroundColor={'transparent'}
                    >
                        <Flex justifyContent="space-between" width="100%">
                            <Text>Account</Text>
                            <Flex alignSelf={'center'}>
                                {isAccountOpen ? (
                                    <ChevronDownIcon />
                                ) : (
                                    <ChevronRightIcon />
                                )}
                            </Flex>
                        </Flex>
                    </MenuItem>
                    <Collapse in={isAccountOpen} animateOpacity>
                        <Box pl={4} mt={2}>
                            <MenuItem backgroundColor={'transparent'}>
                                <NavLinkMobile
                                    href="/account/profile"
                                    route={route!}
                                    title="My Profile"
                                />
                            </MenuItem>
                            <MenuItem
                                backgroundColor={'transparent'}
                                color="white"
                            >
                                <NavLinkMobile
                                    href="/account/addresses"
                                    route={route!}
                                    title="My Addresses"
                                />
                            </MenuItem>
                        </Box>
                    </Collapse>

                    {/* Toggle Orders Collapse */}
                    <MenuItem
                        onClick={toggleOrdersCollapse}
                        backgroundColor={'transparent'}
                        color="white"
                    >
                        <Flex justifyContent="space-between" width="100%">
                            <Text>Orders</Text>

                            <Flex alignSelf={'center'}>
                                {isOrdersOpen ? (
                                    <ChevronDownIcon />
                                ) : (
                                    <ChevronRightIcon />
                                )}
                            </Flex>
                        </Flex>
                    </MenuItem>
                    <Collapse in={isOrdersOpen} animateOpacity>
                        <Box pl={4} mt={2}>
                            <MenuItem>Order 1</MenuItem>
                            <MenuItem>Order 2</MenuItem>
                            <MenuItem>Order 3</MenuItem>
                            <MenuItem>Order 4</MenuItem>
                        </Box>
                    </Collapse>

                    {!authData.is_verified && (
                        <MenuItem backgroundColor={'transparent'} color="white">
                            <NavLinkMobile
                                href="/account/verify"
                                route={route!}
                                title={'Verify'}
                            />
                        </MenuItem>
                    )}
                    <MenuItem backgroundColor={'transparent'} color="white">
                        <NavLinkMobile
                            href="/account/wishlist"
                            route={route!}
                            title="Wishlist"
                            icon={<FaRegHeart color="white" size="20px" />}
                        />
                    </MenuItem>
                    {authData.is_verified && (
                        <MenuItem backgroundColor={'transparent'} color="white">
                            <NavLinkMobile
                                href="/account/notifications"
                                route={route!}
                                title="Notifications"
                                icon={<FaRegBell color="white" size="22px" />}
                            />
                        </MenuItem>
                    )}
                    {authData.is_verified && (
                        <MenuItem backgroundColor={'transparent'} color="white">
                            <NavLinkMobile
                                href="/account/reviews"
                                route={route!}
                                title={'Reviews'}
                                icon={
                                    <PiNotePencilLight
                                        color="white"
                                        size={'22px'}
                                    />
                                }
                            />
                        </MenuItem>
                    )}
                </MenuList>
            </Menu>
        </Flex>
    );
};

export default AccountNavMobile;
