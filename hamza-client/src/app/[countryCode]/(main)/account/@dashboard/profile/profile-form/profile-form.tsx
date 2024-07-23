'use client';
import React from 'react';
import { Flex, Button, Text } from '@chakra-ui/react';
import ProfileInput from './components/profile-input';
import ProfilePhoneInput from './components/phone-input';
import useProfile from '@store/profile/profile';

const ProfileForm = () => {
    const { firstName, lastName, email, phoneNumber } = useProfile();
    const handleSubmit = () => {
        // Perform form submission or validation logic here
        console.log('Form Submitted', {
            firstName,
            lastName,
            email,
            phoneNumber,
        });
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
                <ProfileInput label="first name" />
                <ProfileInput label="last name" />
            </Flex>

            {/* Birthdate and Email input */}
            <Flex gap={'15px'}>
                <ProfileInput label="birth date" />
                <ProfileInput label="email" />
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
