'use client';

import { Flex, Input, FormControl, FormLabel } from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';

interface ProfileInputProps {
    label: string;
    placeholder: string;
    value?: string;
    setValue: (value: string) => void;
}

const ProfileInput: React.FC<ProfileInputProps> = ({
    label,
    placeholder,
    value,
    setValue,
}) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);
    };

    return (
        <Flex flexDirection={'column'} width={'100%'}>
            <FormControl>
                <FormLabel
                    textTransform={'uppercase'}
                    fontSize={'12px'}
                    ml={{ base: 0, md: '1rem' }}
                    mb={'8px'}
                >
                    {label}
                </FormLabel>
                <Input
                    fontSize={{ base: '14px', md: '16px' }}
                    borderRadius={'12px'}
                    height={{ base: '50px', md: '52px' }}
                    placeholder={placeholder}
                    backgroundColor={'#020202'}
                    border={'none'}
                    type={label.toLowerCase() === 'email' ? 'email' : 'text'}
                    value={value}
                    onChange={handleChange}
                />
            </FormControl>
        </Flex>
    );
};

export default ProfileInput;
