import React from 'react';
import { CreditCard } from '@medusajs/icons';

import Ideal from '@modules/common/icons/ideal';
import Bancontact from '@modules/common/icons/bancontact';
import PayPal from '@modules/common/icons/paypal';

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
    string,
    { title: string; icon: React.JSX.Element }
> = {
    paypal: {
        title: 'PayPal',
        icon: <PayPal />,
    },
    crypto: {
        title: 'Crypto',
        icon: <PayPal />,
    },
    manual: {
        title: 'Test payment',
        icon: <CreditCard />,
    },
    // Add more payment providers here
};

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
    'krw',
    'jpy',
    'vnd',
    'clp',
    'pyg',
    'xaf',
    'xof',
    'bif',
    'djf',
    'gnf',
    'kmf',
    'mga',
    'rwf',
    'xpf',
    'htg',
    'vuv',
    'xag',
    'xdr',
    'xau',
];
