'use client';

import { Flex, Text, Input } from '@chakra-ui/react';
import React, { useState, ChangeEvent, useEffect } from 'react';
import useProfile from '@store/profile/profile';

interface ProfileInputProps {
    label: string;
}

const ProfileInput: React.FC<ProfileInputProps> = ({ label }) => {
    const { firstName, lastName, email, setFirstName, setLastName, setEmail } =
        useProfile();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        switch (label.toLowerCase()) {
            case 'first name':
                setFirstName(value);
                break;
            case 'last name':
                setLastName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        console.log('First Name:', firstName);
        console.log('Last Name:', lastName);
        console.log('Email:', email);
    }, [firstName, lastName, email]);

    return (
        <Flex flexDirection={'column'} maxW={'420px'} width={'100%'}>
            <Text
                textTransform={'uppercase'}
                fontSize={'12px'}
                pl="1rem"
                mb={'8px'}
            >
                {label}
            </Text>
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
            />
        </Flex>
    );
};

export default ProfileInput;
