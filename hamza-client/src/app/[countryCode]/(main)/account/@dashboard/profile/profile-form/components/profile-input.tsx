'use client';

import {
    Flex,
    Text,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
} from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react';
import useProfile from '@store/profile/profile';

interface ProfileInputProps {
    label: string;
}

const ProfileInput: React.FC<ProfileInputProps> = ({ label }) => {
    const { firstName, lastName, email, setFirstName, setLastName, setEmail } =
        useProfile();
    const [error, setError] = useState<string | null>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setError(null); // Reset error on input change

        switch (label.toLowerCase()) {
            case 'first name':
                setFirstName(value);
                if (value.trim() === '') setError('First Name is required');
                break;
            case 'last name':
                setLastName(value);
                if (value.trim() === '') setError('Last Name is required');
                break;
            case 'email':
                setEmail(value);
                break;
            default:
                break;
        }
    };

    const handleBlur = () => {
        if (label.toLowerCase() === 'email' && !/\S+@\S+\.\S+/.test(email)) {
            setError('Email is invalid');
        }
    };

    // useEffect(() => {
    //     console.log('First Name:', firstName);
    //     console.log('Last Name:', lastName);
    //     console.log('Email:', email);
    // }, [firstName, lastName, email]);

    return (
        <Flex flexDirection={'column'} maxW={'420px'} width={'100%'}>
            <FormControl isInvalid={!!error}>
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
                    backgroundColor={'#020202'}
                    border={'none'}
                    type={label.toLowerCase() === 'email' ? 'email' : 'text'}
                    value={
                        label.toLowerCase() === 'first name'
                            ? firstName
                            : label.toLowerCase() === 'last name'
                              ? lastName
                              : email
                    }
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
        </Flex>
    );
};

export default ProfileInput;
