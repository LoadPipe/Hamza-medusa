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
    useDisclosure,
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

    const { isOpen, onOpen, onClose } = useDisclosure(); // Use useDisclosure for menu state

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
            <Menu isOpen={isOpen} onClose={onClose} closeOnSelect={false}>
                <MenuButton
                    as={Button}
                    height="56px"
                    backgroundColor={'#121212'}
                    color="primary.green.900"
                    rightIcon={<ChevronDownIcon color="white" />}
                    onClick={isOpen ? onClose : onOpen}
                >
                    Manage My Account
                </MenuButton>
                <MenuList
                    color={'white'}
                    width={'calc(100vw - 2rem)'}
                    backgroundColor={'#121212'}
                    borderColor={'grey'}
                >
                    {/* Toggle Account Collapse */}
                    <MenuItem
                        onClick={toggleAccountCollapse}
                        backgroundColor={'transparent'}
                    >
                        <Flex justifyContent="space-between" width="100%">
                            <Flex flexDir={'row'} alignItems={'center'}>
                                <CgProfile color="white" size={'22px'} />
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
                                <LiaBoxOpenSolid color="white" size={'22px'} />
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
                                All Orders
                            </MenuItem>
                            <MenuItem
                                backgroundColor={'transparent'}
                                color="white"
                            >
                                Processing
                            </MenuItem>
                            <MenuItem
                                backgroundColor={'transparent'}
                                color="white"
                            >
                                Shipped
                            </MenuItem>
                            <MenuItem
                                backgroundColor={'transparent'}
                                color="white"
                            >
                                Delivered
                            </MenuItem>
                            <MenuItem
                                backgroundColor={'transparent'}
                                color="white"
                            >
                                Canceled
                            </MenuItem>
                        </Box>
                    </Collapse>

                    {!authData.is_verified && (
                        <MenuItem
                            backgroundColor={'transparent'}
                            color="white"
                            fontWeight={600}
                        >
                            <NavLinkMobile
                                href="/account/verify"
                                route={route!}
                                title={'Verify'}
                                onClick={onClose}
                            />
                        </MenuItem>
                    )}
                    <MenuItem
                        backgroundColor={'transparent'}
                        color="white"
                        fontWeight={600}
                    >
                        <NavLinkMobile
                            href="/account/wishlist"
                            route={route!}
                            title="Wishlist"
                            icon={<FaRegHeart color="white" size="20px" />}
                            onClick={onClose}
                        />
                    </MenuItem>
                    {authData.is_verified && (
                        <MenuItem
                            backgroundColor={'transparent'}
                            color="white"
                            fontWeight={600}
                        >
                            <NavLinkMobile
                                href="/account/notifications"
                                route={route!}
                                title="Notifications"
                                icon={<FaRegBell color="white" size="22px" />}
                                onClick={onClose}
                            />
                        </MenuItem>
                    )}
                    {authData.is_verified && (
                        <MenuItem
                            backgroundColor={'transparent'}
                            color="white"
                            fontWeight={600}
                        >
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
                                onClick={onClose}
                            />
                        </MenuItem>
                    )}
                </MenuList>
            </Menu>
        </Flex>
    );
};

export default AccountNavMobile;
