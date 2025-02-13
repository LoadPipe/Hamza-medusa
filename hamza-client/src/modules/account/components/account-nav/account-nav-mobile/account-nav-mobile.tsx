'use client';
import { CgProfile } from 'react-icons/cg';
import { LiaBoxOpenSolid } from 'react-icons/lia';
import { FaRegHeart, FaRegBell } from 'react-icons/fa';
import { PiNotePencilLight } from 'react-icons/pi';
import { CiLogout } from 'react-icons/ci';
import { IoSettingsOutline } from 'react-icons/io5';
import { Customer } from '@medusajs/medusa';
import { MdOutlineRateReview } from 'react-icons/md';
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
    useDisclosure,
} from '@chakra-ui/react';
import {
    ChevronDownIcon,
    ChevronUpIcon,
    ChevronRightIcon,
} from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useOrderTabStore } from '@/zustand/order-tab-state';

import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import NavLink from '../components/nav-link';
import NavLinkMobile from '../components/nav-link-mobile';
import NavLinkMobileOrders from '../components/nav-link-mobile-orders';
import { LogoutMobile } from '../components/logout-mobile';

import { TABS } from '@/modules/order-tab-management';
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

    // Open and close main menu
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Open and close child list of Account and Orders
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

    const setOrderActiveTab = useOrderTabStore(
        (state) => state.setOrderActiveTab
    );
    const handleTabChange = (tab: any) => {
        setOrderActiveTab(tab);
        // navigate to OrderOverview or update the URL to reflect the active tab
    };

    // useEffect(() => {
    //     if (searchParams.get('verify') === 'true') {
    //         setCustomerAuthData({
    //             ...authData,
    //             is_verified: true,
    //         });
    //     } else {
    //         if (
    //             searchParams.get('verify') === 'false' &&
    //             searchParams.get('error') === 'true'
    //         ) {
    //             router.push(`/${countryCode}/verify-email?auth_error=true`);
    //         }
    //     }
    // }, []);

    useEffect(() => {
        if (
            route == `/${countryCode}/account` &&
            !authData.is_verified &&
            !searchParams.get('verify')
        ) {
            router.push(`/${countryCode}/account/profile`);
        }
    }, [authData.is_verified, countryCode, route, router, searchParams]);

    return (
        <Flex flexDirection={'column'} width={'100%'}>
            <Menu
                isOpen={isOpen}
                onClose={onClose}
                closeOnSelect={false}
                placement="bottom"
            >
                <MenuButton
                    as={Button}
                    height="56px"
                    backgroundColor={'#121212'}
                    color="primary.green.900"
                    leftIcon={
                        <IoSettingsOutline color="#94D42A" size={'22px'} />
                    }
                    rightIcon={<ChevronDownIcon color="white" />}
                    onClick={isOpen ? onClose : onOpen}
                    _hover={{ backgroundColor: '#121212' }}
                    _active={{
                        backgroundColor: '#121212',
                        borderColor: '#555555',
                        borderWidth: '1px',
                    }}
                    _focus={{
                        boxShadow: 'none',
                    }}
                >
                    Manage My Account
                </MenuButton>
                <MenuList
                    color={'white'}
                    width={'calc(100vw - 2rem)'}
                    backgroundColor={'#121212'}
                    borderColor={'#555555'}
                >
                    {/* Toggle Account Collapse */}
                    <MenuItem
                        onClick={toggleAccountCollapse}
                        backgroundColor={'transparent'}
                    >
                        <Flex justifyContent="space-between" width="100%">
                            <Flex flexDir={'row'} alignItems={'center'}>
                                <Flex width={'22px'} height={'22px'}>
                                    <CgProfile
                                        color="white"
                                        size={'20px'}
                                        style={{
                                            alignSelf: 'center',
                                            margin: '0 auto',
                                        }}
                                    />
                                </Flex>

                                <Text ml={2} fontWeight={600}>
                                    Account
                                </Text>
                            </Flex>

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
                                    onClick={onClose}
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
                                    onClick={onClose}
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
                            <Flex flexDir={'row'} alignItems={'center'}>
                                <Flex width={'22px'} height={'22px'}>
                                    <LiaBoxOpenSolid
                                        color="white"
                                        size={'22px'}
                                        style={{
                                            alignSelf: 'center',
                                            margin: '0 auto',
                                        }}
                                    />
                                </Flex>
                                <Text ml={2} fontWeight={600}>
                                    Orders
                                </Text>
                            </Flex>

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
                            <MenuItem
                                backgroundColor={'transparent'}
                                color="white"
                            >
                                <NavLinkMobileOrders
                                    href="/account/orders"
                                    route={route!}
                                    title={'All Orders'}
                                    tab={'All Orders'}
                                    handleTabChange={() =>
                                        handleTabChange(TABS.ALL)
                                    }
                                    onClick={onClose}
                                />
                            </MenuItem>
                            <MenuItem
                                backgroundColor={'transparent'}
                                color="white"
                            >
                                <NavLinkMobileOrders
                                    href="/account/orders"
                                    route={route!}
                                    title={'Processing'}
                                    tab={'Processing'}
                                    handleTabChange={() =>
                                        handleTabChange(TABS.PROCESSING)
                                    }
                                    onClick={onClose}
                                />
                            </MenuItem>
                            <MenuItem
                                backgroundColor={'transparent'}
                                color="white"
                            >
                                <NavLinkMobileOrders
                                    href="/account/orders"
                                    route={route!}
                                    title={'In Transit'}
                                    tab={'In Transit'}
                                    handleTabChange={() =>
                                        handleTabChange(TABS.SHIPPED)
                                    }
                                    onClick={onClose}
                                />
                            </MenuItem>
                            <MenuItem
                                backgroundColor={'transparent'}
                                color="white"
                            >
                                <NavLinkMobileOrders
                                    href="/account/orders"
                                    route={route!}
                                    title={'Delivered'}
                                    tab={'Delivered'}
                                    handleTabChange={() =>
                                        handleTabChange(TABS.DELIVERED)
                                    }
                                    onClick={onClose}
                                />
                            </MenuItem>
                            <MenuItem
                                backgroundColor={'transparent'}
                                color="white"
                            >
                                <NavLinkMobileOrders
                                    href="/account/orders"
                                    route={route!}
                                    title={'Cancelled'}
                                    tab={'Cancelled'}
                                    handleTabChange={() =>
                                        handleTabChange(TABS.CANCELLED)
                                    }
                                    onClick={onClose}
                                />
                            </MenuItem>
                            <MenuItem
                                backgroundColor={'transparent'}
                                color="white"
                            >
                                <NavLinkMobileOrders
                                    href="/account/orders"
                                    route={route!}
                                    title={'Refund'}
                                    tab={'Refund'}
                                    handleTabChange={() =>
                                        handleTabChange(TABS.REFUND)
                                    }
                                    onClick={onClose}
                                />
                            </MenuItem>
                        </Box>
                    </Collapse>

                    {!authData.is_verified && (
                        <MenuItem backgroundColor={'transparent'} color="white">
                            <NavLinkMobile
                                href="/account/verify"
                                route={route!}
                                title={'Verify'}
                                icon={
                                    <MdOutlineRateReview
                                        size="20px"
                                        style={{
                                            alignSelf: 'center',
                                            margin: '0 auto',
                                        }}
                                    />
                                }
                                fontWeight={600}
                                onClick={onClose}
                            />
                        </MenuItem>
                    )}
                    <MenuItem backgroundColor={'transparent'} color="white">
                        <NavLinkMobile
                            href="/account/wishlist"
                            route={route!}
                            title="Wishlist"
                            icon={
                                <FaRegHeart
                                    size="20px"
                                    style={{
                                        alignSelf: 'center',
                                        margin: '0 auto',
                                    }}
                                />
                            }
                            fontWeight={600}
                            onClick={onClose}
                        />
                    </MenuItem>
                    {authData.is_verified && (
                        <MenuItem backgroundColor={'transparent'} color="white">
                            <NavLinkMobile
                                href="/account/notifications"
                                route={route!}
                                title="Notifications"
                                icon={
                                    <FaRegBell
                                        size="20px"
                                        style={{
                                            alignSelf: 'center',
                                            margin: '0 auto',
                                        }}
                                    />
                                }
                                fontWeight={600}
                                onClick={onClose}
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
                                        size="20px"
                                        style={{
                                            alignSelf: 'center',
                                            margin: '0 auto',
                                        }}
                                    />
                                }
                                fontWeight={600}
                                onClick={onClose}
                            />
                        </MenuItem>
                    )}
                    <LogoutMobile />
                </MenuList>
            </Menu>
        </Flex>
    );
};

export default AccountNavMobile;
