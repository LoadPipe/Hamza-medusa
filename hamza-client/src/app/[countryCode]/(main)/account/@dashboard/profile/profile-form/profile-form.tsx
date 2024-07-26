'use client';
import React, { useEffect, useState } from 'react';
import { Flex, Button, Text } from '@chakra-ui/react';
import ProfileInput from './components/profile-input';
import ProfilePhoneInput from './components/phone-input';
import { updateCustomer } from '@lib/data';
import { getCustomer } from '@lib/data';
import ProfileImage from './components/profile-image';

const ProfileForm = () => {
    // Hooks Form
    const [firstNameValue, setFirstNameValue] = useState<string>('');
    const [lastNameValue, setLastNameValue] = useState<string>('');
    const [emailValue, setEmailValue] = useState<string>('');
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    // Hooks Avatar
    const [avatarFirstName, setAvatarFirstName] = useState<string>('');
    const [avatarLastName, setAvatarLastName] = useState<string>('');

    //  Fetch customer and update hook states
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const customer = await getCustomer();
                setFirstNameValue(customer.first_name);
                setLastNameValue(customer.last_name);
                setAvatarFirstName(customer.first_name);
                setAvatarLastName(customer.last_name);
                setEmailValue(
                    customer.email.includes('@evm.blockchain')
                        ? ''
                        : customer.email
                );
            } catch (error) {
                console.error('Error fetching customer data:', error);
            }
        };

        fetchCustomer();
    }, [isSubmitted]);

    const handleSubmit = async () => {
        if (firstNameValue === '' || lastNameValue === '') {
            alert('First name and last name fields are required');
            return;
        }
        try {
            const updatedCustomer = {
                first_name: firstNameValue,
                last_name: lastNameValue,
                ...(emailValue && { email: emailValue }),
            };
            await updateCustomer(updatedCustomer);
            setIsSubmitted((prev) => !prev); // Toggle the state to trigger useEffect
            alert('Profile updated successfully');
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
            <ProfileImage
                firstName={avatarFirstName}
                lastName={avatarLastName}
            />
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
                    placeholder={firstNameValue}
                    label="first name"
                    value={firstNameValue}
                    setValue={setFirstNameValue}
                />
                <ProfileInput
                    placeholder={lastNameValue}
                    label="last name"
                    value={lastNameValue}
                    setValue={setLastNameValue}
                />
            </Flex>

            {/* Email input */}
            <Flex gap={'15px'}>
                <ProfileInput
                    placeholder={emailValue}
                    label="email"
                    value={emailValue}
                    setValue={setEmailValue}
                />
            </Flex>

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
