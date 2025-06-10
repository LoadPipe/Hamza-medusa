'use client';

import React from 'react';
import ProfileCurrency from '@/modules/account/components/profile/components/profile-form/components/profile-currency';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';

type NavProfileCurrencyProps = {
    iconOnly?: boolean;
};

const NavProfileCurrency: React.FC<NavProfileCurrencyProps> = ({ iconOnly = false }) => {
    const preferred_currency_code = useCustomerAuthStore(
        (state) => state.preferred_currency_code
    );
    const setCustomerPreferredCurrency = useCustomerAuthStore(
        (state) => state.setCustomerPreferredCurrency
    );
    const authStatus = useCustomerAuthStore(
        (state) => state.authData.status
    );
    const customerId = useCustomerAuthStore(
        (state) => state.authData.customer_id
    );

    // Only show if user is not logged in (unauthenticated or no customer_id)
    const isLoggedIn = authStatus === 'authenticated' && customerId;
    
    if (isLoggedIn) {
        return null;
    }

    return (
        <ProfileCurrency
            preferredCurrencyCode={preferred_currency_code}
            setCustomerPreferredCurrency={setCustomerPreferredCurrency}
            iconOnly={iconOnly}
            className="nav-currency-selector"
        />
    );
};

export default NavProfileCurrency;