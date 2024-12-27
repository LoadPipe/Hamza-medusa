'use client';

import { Customer } from '@medusajs/medusa';
import React, { useEffect } from 'react';
import { useFormState } from 'react-dom';

import Input from '@modules/common/components/input';

import AccountInfo from '../account-info';
import { updateCustomerEmail } from '@modules/account/actions';

type MyInformationProps = {
    customer: Omit<Customer, 'password_hash'>;
};

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
    const [successState, setSuccessState] = React.useState(false);

    const [state, formAction] = useFormState(updateCustomerEmail, {
        error: false,
        success: false,
    });

    const clearState = () => {
        setSuccessState(false);
    };

    useEffect(() => {
        setSuccessState(state.success);
    }, [state]);

    return (
        <div>
            <span className="uppercase text-ui-fg-base text-xs">EMAIL</span>
            <div className="grid grid-cols-1 gap-y-2">
                <span>{customer?.email ? customer.email.endsWith('@evm.blockchain') ? '' : customer.email : ''}</span>
            </div>
        </div>
    );
};

export default ProfileEmail;
