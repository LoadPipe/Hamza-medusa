'use client';

import React from 'react';
import { Select } from '@chakra-ui/react';

type ProfileCurrencyProps = {
    preferred_currency_code: string | null;
    setCustomerPreferredCurrency: (currency: string) => void;
};

const ProfileCurrency: React.FC<ProfileCurrencyProps> = ({
    preferred_currency_code,
    setCustomerPreferredCurrency,
}) => {
    const handleCurrencyChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const newCurrencyValue = event.target.value;
        setCustomerPreferredCurrency(newCurrencyValue);
    };

    return (
        <div className="currency-dropdown grid grid-cols-2 gap-x-4">
            <label htmlFor="currency-select">Preferred payment currency:</label>
            <Select
                className="bg-black"
                id="currency-select"
                value={preferred_currency_code!}
                onChange={handleCurrencyChange}
                color={'white'}
            >
                <option
                    value="usdc"
                    style={{ backgroundColor: 'black', color: 'white' }}
                >
                    USDC
                </option>
                <option
                    value="usdt"
                    style={{ backgroundColor: 'black', color: 'white' }}
                >
                    USDT
                </option>
                <option
                    value="eth"
                    style={{ backgroundColor: 'black', color: 'white' }}
                >
                    ETH
                </option>
            </Select>
        </div>
    );
};

export default ProfileCurrency;
