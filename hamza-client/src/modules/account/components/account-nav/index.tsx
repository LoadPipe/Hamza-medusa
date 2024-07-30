'use client';

import { Customer } from '@medusajs/medusa';
import { clx } from '@medusajs/ui';
import { ArrowRightOnRectangle } from '@medusajs/icons';
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from 'next/navigation';
import { Flex, Box, Button, Text } from '@chakra-ui/react';
import ChevronDown from '@modules/common/icons/chevron-down';
import { signOut } from '@modules/account/actions';
import User from '@modules/common/icons/user';
import MapPin from '@modules/common/icons/map-pin';
import Package from '@modules/common/icons/package';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import NavLink from './components/nav-link';

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
        <div style={{ width: '245px' }}>
            <div className="small:hidden">
                {route !== `/${countryCode}/account` ? (
                    <LocalizedClientLink
                        href="/account"
                        className="flex items-center gap-x-2 text-small-regular py-2"
                    >
                        <>
                            <ChevronDown className="transform rotate-90" />
                            <span>Account</span>
                        </>
                    </LocalizedClientLink>
                ) : (
                    <>
                        <div className="text-xl-semi mb-4 ">
                            Hello {customer?.first_name}
                        </div>
                        <div className="text-base-regular">
                            <ul>
                                <li>
                                    <LocalizedClientLink
                                        href="/account/profile"
                                        className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                                    >
                                        <>
                                            <div className="flex items-center gap-x-2">
                                                <User size={20} />
                                                <span>Profile</span>
                                            </div>
                                            <ChevronDown className="transform -rotate-90" />
                                        </>
                                    </LocalizedClientLink>
                                </li>

                                {authData.is_verified === false && (
                                    <li>
                                        <LocalizedClientLink
                                            href="/account/profile"
                                            className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                                        >
                                            <>
                                                <div className="flex items-center gap-x-2">
                                                    <User size={20} />
                                                    <span>Verify</span>
                                                </div>
                                                <ChevronDown className="transform -rotate-90" />
                                            </>
                                        </LocalizedClientLink>
                                    </li>
                                )}

                                {authData.is_verified && (
                                    <li>
                                        <LocalizedClientLink
                                            href="/account/addresses"
                                            className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                                        >
                                            <>
                                                <div className="flex items-center gap-x-2">
                                                    <MapPin size={20} />
                                                    <span>Addresses</span>
                                                </div>
                                                <ChevronDown className="transform -rotate-90" />
                                            </>
                                        </LocalizedClientLink>
                                    </li>
                                )}
                                <li>
                                    <LocalizedClientLink
                                        href="/account/orders"
                                        className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                                    >
                                        <div className="flex items-center gap-x-2">
                                            <Package size={20} />
                                            <span>Orders</span>
                                        </div>
                                        <ChevronDown className="transform -rotate-90" />
                                    </LocalizedClientLink>
                                </li>

                                {authData.is_verified && (
                                    <li>
                                        <LocalizedClientLink
                                            href="/account/notifications"
                                            className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                                        >
                                            <div className="flex items-center gap-x-2">
                                                <Package size={20} />
                                                <span>Notifications</span>
                                            </div>
                                            <ChevronDown className="transform -rotate-90" />
                                        </LocalizedClientLink>
                                    </li>
                                )}
                                <li>
                                    <button
                                        type="button"
                                        className="flex items-center justify-between py-4 border-b border-gray-200 px-8 w-full"
                                        onClick={handleLogout}
                                    >
                                        <div className="flex items-center gap-x-2">
                                            <ArrowRightOnRectangle />
                                            <span>Log out</span>
                                        </div>
                                        <ChevronDown className="transform -rotate-90" />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </div>

            <Flex flexDirection={'column'} width={'245px'}>
                <NavLink
                    href="/account/profile"
                    route={route!}
                    title={'Profile'}
                />
                {authData.is_verified && (
                    <NavLink
                        href="/account/verify"
                        route={route!}
                        title={'Verify'}
                    />
                )}
                <NavLink
                    href="/account/addresses"
                    route={route!}
                    title={'Addresses'}
                />
                <NavLink
                    href="/account/orders"
                    route={route!}
                    title={'Orders'}
                />
                <NavLink
                    href="/account/notifications"
                    route={route!}
                    title={'Notifications'}
                />
                <NavLink
                    href="/account/reviews"
                    route={route!}
                    title={'Reviews'}
                />
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
        </div>
    );
};

export default AccountNav;
