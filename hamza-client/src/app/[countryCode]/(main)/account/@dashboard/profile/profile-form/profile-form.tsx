'use client';
import React, { useEffect } from 'react';
import { Flex, Button, Text } from '@chakra-ui/react';
import ProfileInput from './components/profile-input';
import ProfilePhoneInput from './components/phone-input';
import useProfile from '@store/profile/profile';
import { updateCustomer } from '@lib/data';

type Customer = {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
};
const ProfileForm = ({ customer }: { customer: Customer }) => {
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        setFirstName,
        setLastName,
        setEmail,
        setPhoneNumber,
    } = useProfile();

    const clearStates = async () => {
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
    };

    const handleSubmit = async () => {
        if (!firstName && !lastName && !email && !phoneNumber) {
            alert('No changes');
            return;
        }

        try {
            const updatedCustomer = {
                first_name: firstName || customer.first_name,
                last_name: lastName || customer.last_name,
                email: email || customer.email,
                phone: phoneNumber || customer.phone,
            };
            await updateCustomer(updatedCustomer);
            console.log(customer);
            alert('Profile updated successfully');
            clearStates();
        } catch (error) {
            alert('Failed to update profile');
            console.error('Error updating profile:', error);
        }
    };

    return (
        <Flex
            mt={'2rem'}
            flexDirection={'column'}
            maxW={'858px'}
            width={'100%'}
            gap={'23px'}
        >
            <Text
                fontSize={'18px'}
                fontWeight={600}
                color={'primary.indigo.900'}
            >
                Personal Information
            </Text>

            {/* First and last name input */}
            <Flex gap={'15px'}>
                <ProfileInput
                    placeholder={customer.first_name}
                    label="first name"
                />
                <ProfileInput
                    placeholder={customer.last_name}
                    label="last name"
                />
            </Flex>

            {/* Birthdate and Email input */}
            <Flex gap={'15px'}>
                <ProfilePhoneInput label="phone number" />
                <ProfileInput placeholder={customer.email} label="email" />
            </Flex>

            {/* Phone input */}

            <Button
                mt="0.5rem"
                backgroundColor={'primary.indigo.900'}
                color={'white'}
                borderRadius={'37px'}
                fontSize={'18px'}
                fontWeight={600}
                height={'47px'}
                width={'190px'}
                onClick={handleSubmit}
            >
                Update
            </Button>
        </Flex>
    );
};

export default ProfileForm;
