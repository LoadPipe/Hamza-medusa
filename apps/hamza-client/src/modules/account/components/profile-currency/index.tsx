'use client';

import React from 'react';
import { Flex, FormLabel, Select } from '@chakra-ui/react';

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
        <Flex flexDirection={'column'} width={'100%'}>
            <FormLabel
                textTransform={'uppercase'}
                fontSize={'12px'}
                ml={{ base: 0, md: '1rem' }}
                mb={'8px'}
            >
                Preferred payment currency
            </FormLabel>
            <Select
                borderRadius={'12px'}
                height={{ base: '50px', md: '52px' }}
                backgroundColor={'#020202'}
                border={'none'}
                value={preferred_currency_code!}
                onChange={handleCurrencyChange}
                color={'white'}
                fontSize={'14px'}
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
        </Flex>
    );
};

export default ProfileCurrency;
