'use client';
import React from 'react';
import { Flex, Button, Text } from '@chakra-ui/react';
import ProfileInput from './components/profile-input';
import ProfilePhoneInput from './components/phone-input';
import useProfile from '@store/profile/profile';
import { updateCustomer } from '@lib/data';
import { customerKeys } from 'medusa-react';

type Customer = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
};
const ProfileForm = ({ customer }: { customer: Customer }) => {
    const { firstName, lastName, email, phoneNumber } = useProfile();
    const handleSubmit = async () => {
        try {
            const updatedCustomer = {
                first_name: firstName,
                last_name: 'boy',
                email: 'johnbajada01@gmail.com',
            };
            await updateCustomer(updatedCustomer);
            alert('Profile updated successfully');
            console.log(customer);
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
                <ProfileInput
                    placeholder={customer.first_name}
                    label="birth date"
                />
                <ProfileInput placeholder={customer.email} label="email" />
            </Flex>

            {/* Phone input */}
            <ProfilePhoneInput label="phone number" />
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
