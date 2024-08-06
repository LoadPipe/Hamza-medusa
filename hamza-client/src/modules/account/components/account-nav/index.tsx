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
        <Flex style={{ width: '245px' }}>
            <Flex flexDirection={'column'} width={'245px'}>
                <NavLink
                    href="/account/profile"
                    route={route!}
                    title={'Profile'}
                />
                {!authData.is_verified && (
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
