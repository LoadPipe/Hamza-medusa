'use client';

import React from 'react';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import NavLink from '@modules/layout/templates/nav-update/nav-link/nav-link';

const NavTernary = () => {
    const { authData } = useCustomerAuthStore();

    return (
        <React.Fragment>
            {authData.status == 'authenticated' ? (
                <React.Fragment>
                    <NavLink href="/account" title="Account" />
                    {!authData.is_verified && (
                        <NavLink href="/verify-email" title="Verify Account" />
                    )}
                </React.Fragment>
            ) : (
                <React.Fragment></React.Fragment>
            )}
        </React.Fragment>
    );
};

export default NavTernary;
