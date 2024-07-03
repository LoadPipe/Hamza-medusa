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

import ChevronDown from '@modules/common/icons/chevron-down';
import { signOut } from '@modules/account/actions';
import User from '@modules/common/icons/user';
import MapPin from '@modules/common/icons/map-pin';
import Package from '@modules/common/icons/package';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

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
        return;
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
        <div>
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
            <div className="hidden small:block">
                <div>
                    <div className="pb-4">
                        <h3 className="text-base-semi">Account</h3>
                    </div>
                    <div className="text-base-regular">
                        <ul className="flex mb-0 justify-start items-start flex-col gap-y-4 ">
                            {authData.is_verified && (
                                <li className="text-white">
                                    <AccountNavLink
                                        href="/account"
                                        route={route!}
                                    >
                                        Overview
                                    </AccountNavLink>
                                </li>
                            )}

                            <li>
                                <AccountNavLink
                                    href="/account/profile"
                                    route={route!}
                                >
                                    Profile
                                </AccountNavLink>
                            </li>
                            {authData.is_verified && (
                                <li>
                                    <AccountNavLink
                                        href="/account/addresses"
                                        route={route!}
                                    >
                                        Addresses
                                    </AccountNavLink>
                                </li>
                            )}

                            <li>
                                <AccountNavLink
                                    href="/account/orders"
                                    route={route!}
                                >
                                    Orders
                                </AccountNavLink>
                            </li>
                            {authData.is_verified && (
                                <li>
                                    <AccountNavLink
                                        href="/account/notifications"
                                        route={route!}
                                    >
                                        Notifications
                                    </AccountNavLink>
                                </li>
                            )}
                            <li>
                                <AccountNavLink
                                    href="/account/reviews"
                                    route={route!}
                                >
                                    Reviews
                                </AccountNavLink>
                            </li>

                            <li className="text-grey-700">
                                <button type="button" onClick={handleLogout}>
                                    Log out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

type AccountNavLinkProps = {
    href: string;
    route: string;
    children: React.ReactNode;
};

const AccountNavLink = ({ href, route, children }: AccountNavLinkProps) => {
    const { countryCode }: { countryCode: string } = useParams();

    const active = route.split(countryCode)[1] === href;
    return (
        <LocalizedClientLink
            href={href}
            className={clx('text-ui-fg-subtle hover:text-gray-200 text-white', {
                'text-white font-semibold': active,
            })}
        >
            {children}
        </LocalizedClientLink>
    );
};

export default AccountNav;
