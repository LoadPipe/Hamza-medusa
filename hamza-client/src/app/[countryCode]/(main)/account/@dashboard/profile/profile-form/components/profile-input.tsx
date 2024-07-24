'use client';

import {
    Flex,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
} from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import useProfile from '@store/profile/profile';

interface ProfileInputProps {
    label: string;
    placeholder: string;
    value?: string;
    setValue: string;
}

const ProfileInput: React.FC<ProfileInputProps> = ({
    label,
    placeholder,
    value,
    setValue,
}) => {
    const [valueInput, setValueInput] = useState('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);
    };

    return (
        <Flex flexDirection={'column'} maxW={'420px'} width={'100%'}>
            <FormControl>
                <FormLabel
                    textTransform={'uppercase'}
                    fontSize={'12px'}
                    pl="1rem"
                    mb={'8px'}
                >
                    {label}
                </FormLabel>
                <Input
                    borderRadius={'12px'}
                    height={'52px'}
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
