'use client';
import React, { useEffect, useState } from 'react';
import { Flex, Button, Text } from '@chakra-ui/react';
import ProfileInput from './components/profile-input';
import { updateCustomer } from '@lib/data';
import { getCustomer } from '@lib/data';
import ProfileImage from './components/profile-image';
import toast from 'react-hot-toast';

const ProfileForm = () => {
    // Todo: disable submiting if fields have not been changed
    // Todo: add error message on input
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
                if (customer === null) {
                    return;
                } else {
                    setFirstNameValue(customer.first_name);
                    setLastNameValue(customer.last_name);
                    setAvatarFirstName(customer.first_name);
                    setAvatarLastName(customer.last_name);
                    setEmailValue(
                        customer.email.includes('@evm.blockchain')
                            ? ''
                            : customer.email
                    );
                }
            } catch (error) {
                console.error('Error fetching customer data:', error);
            }
        };

        fetchCustomer();
    }, [isSubmitted]);

    const handleSubmit = async () => {
        if (firstNameValue === '' || lastNameValue === '') {
            toast.error('Field can not be empty');
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
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
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
            {emailValue?.length > 0 &&
                <>
                    <Text
                        fontSize={'18px'}
                        fontWeight={600}
                        color={'primary.indigo.900'}
                    >
                        Email
                    </Text>
                    <Text
                        fontSize={'16px'}
                        fontWeight={600}
                    >
                        {emailValue}
                    </Text>
                </>
            }

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
