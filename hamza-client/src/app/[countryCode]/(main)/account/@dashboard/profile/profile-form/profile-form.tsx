'use client';
import React, { useEffect, useState } from 'react';
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
    // Hooks
    const [firstNameValue, setFirstNameValue] = useState(customer.first_name);
    const [lastNameValue, setLastNameValue] = useState(customer.last_name);
    const [emailValue, setEmailValue] = useState(customer.email);
    // Global States
    const { firstName, lastName, email, setFirstName, setLastName, setEmail } =
        useProfile();

    useEffect(() => {
        setFirstName(firstNameValue);
        setLastName(lastNameValue);
        setEmail(emailValue);
    }, []);

    // Update Global States
    const updateGlobalProfileStates = async () => {
        setFirstName(firstNameValue);
        setLastName(lastNameValue);
        setEmail(emailValue);
    };

    // Handle Submit
    const handleSubmit = async () => {
        if (
            firstNameValue === '' ||
            lastNameValue === '' ||
            emailValue === ''
        ) {
            alert('Some fields are empty');
            return;
        }
        try {
            await updateGlobalProfileStates();
            const updatedCustomer = {
                first_name: firstNameValue,
                last_name: lastNameValue,
                email: emailValue,
            };
            await updateCustomer(updatedCustomer);
            await alert('Profile updated successfully');
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
                    placeholder={firstName}
                    label="first name"
                    value={firstNameValue}
                    setValue={setFirstNameValue}
                />
                <ProfileInput
                    placeholder={lastName}
                    label="last name"
                    value={lastNameValue}
                    setValue={setLastNameValue}
                />
            </Flex>

            {/* Birthdate and Email input */}
            <Flex gap={'15px'}>
                <ProfileInput
                    placeholder={email}
                    label="email"
                    value={emailValue}
                    setValue={setEmailValue}
                />
                {/* <ProfilePhoneInput label="phone number" />
                // <ProfileInput placeholder={customer.email} label="email" /> */}
            </Flex>

            {/* Phone input */}

            <Button
                mt="1rem"
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
