'use client';

import React, { useState, useEffect } from 'react';
import { Select } from '@chakra-ui/react';
import { Customer } from '@medusajs/medusa';
import axios from 'axios';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';

type MyInformationProps = {
    customer: Omit<Customer, 'password_hash'>;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

const ProfileCurrency: React.FC<MyInformationProps> = ({ customer }) => {
    // State to store the current currency
    const { preferred_currency_code, setCustomerPreferredCurrency } =
        useCustomerAuthStore();

    // Simulate updating the currency in customer profile
    const updateCurrency = async (newCurrency: string) => {
        console.log(`Currency updated to ${newCurrency}`);
        console.log(`Customer is ${customer.id}`);
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'}/custom/update-currency`,
                {
                    customer_id: customer.id,
                    preferred_currency: newCurrency,
                }
            );
            setCustomerPreferredCurrency(newCurrency);
        } catch (error) {
            console.error('Error updating currency', error);
        }

        // Here you would call an API or some internal method to update the customer profile
    };

    // Handler for currency change from dropdown
    const handleCurrencyChange = (event: any) => {
        const newCurrency = event.target.value;
        setCustomerPreferredCurrency(newCurrency);
        updateCurrency(newCurrency);
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
                <option value="usdc" style={{ backgroundColor: 'black', color: 'white' }}>USDC</option>
                <option value="usdt" style={{ backgroundColor: 'black', color: 'white' }}>USDT</option>
                <option value="eth" style={{ backgroundColor: 'black', color: 'white' }}>ETH</option>
            </Select>
        </div>
    );
};

export default ProfileCurrency;
