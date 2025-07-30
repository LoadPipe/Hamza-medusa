'use client';

import React from 'react';
import ProfileCurrency from '@/modules/account/components/profile/components/profile-form/components/profile-currency';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';

type NavProfileCurrencyProps = {
    iconOnly?: boolean;
};

const NavProfileCurrency: React.FC<NavProfileCurrencyProps> = ({
    iconOnly = false,
}) => {
    const preferred_currency_code = useCustomerAuthStore(
        (state) => state.preferred_currency_code
    );
    const setCustomerPreferredCurrency = useCustomerAuthStore(
        (state) => state.setCustomerPreferredCurrency
    );
    const authStatus = useCustomerAuthStore((state) => state.authData.status);
    const customerId = useCustomerAuthStore(
        (state) => state.authData.customer_id
    );
    const anonymous = useCustomerAuthStore((state) => state.authData.anonymous);

    // Only show if user is not logged in (unauthenticated or no customer_id)
    const isLoggedIn = authStatus === 'authenticated' && customerId;

    if (isLoggedIn && !anonymous) {
        return null;
    }

    return (
        <ProfileCurrency
            preferredCurrencyCode={preferred_currency_code}
            setCustomerPreferredCurrency={setCustomerPreferredCurrency}
            iconOnly={iconOnly}
            className={
                iconOnly
                    ? 'nav-currency-selector-mobile'
                    : 'nav-currency-selector-desktop'
            }
        />
    );
};

export default NavProfileCurrency;
