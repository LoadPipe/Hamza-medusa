'use client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Flex, Button, Text } from '@chakra-ui/react';
import ProfileInput from './components/profile-input';
// import ProfileImage from './components/profile-image';
import ProfileImage from '@/modules/common/components/customer-icon/profile-image';

import ProfileCurrency from '@modules/account/components/profile-currency';
import { getVerificationStatus, setCurrency, updateCustomer } from '@lib/data';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';

const ProfileForm: React.FC<any> = ({ customer }) => {
    // Todo: disable submitting if fields have not been changed
    // Todo: add error message on input
    // Hooks Form
    const [firstNameValue, setFirstNameValue] = useState<string>('');
    const [lastNameValue, setLastNameValue] = useState<string>('');
    const [emailValue, setEmailValue] = useState<string>('');
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [customerId, setCustomerId] = useState<string>('');
    const {
        preferred_currency_code,
        setCustomerPreferredCurrency,
        setIsVerified,
        authData,
    } = useCustomerAuthStore();
    // Hooks Avatar
    const [avatarFirstName, setAvatarFirstName] = useState<string>('');
    const [avatarLastName, setAvatarLastName] = useState<string>('');

    // Queries
    // const {
    //     data: customer,
    //     isError,
    //     isLoading,
    // } = useQuery(
    //     ['customer'],
    //     async () => {
    //         const response = await axios.get(
    //             'http://localhost:9000/custom/customer?customer_id=cus_01J8MD5FK7AT7CRHCXGNVXTB54'
    //         );
    //         return response.data; // This will be your customer data
    //     },
    //     {
    //         staleTime: 5 * 60 * 1000, // data is considered fresh for 5 minutes
    //         retry: 3, // retry the query 3 times in case of failure
    //     }
    // );

    // Update local state with customer data
    useEffect(() => {
        if (customer) {
            setFirstNameValue(customer.first_name);
            setLastNameValue(customer.last_name);
            setAvatarFirstName(customer.first_name);
            setAvatarLastName(customer.last_name);
            setCustomerId(customer.id);
            setEmailValue(
                customer.email.includes('@evm.blockchain') ? '' : customer.email
            );
        }
    }, [customer]);

    // Grab the customer's verification status from db and update the store
    useEffect(() => {
        if (authData.is_verified || !customerId) return;
        const fetchVerificationStatus = async () => {
            try {
                const verificationStatus =
                    await getVerificationStatus(customerId);
                setIsVerified(verificationStatus.data);
            } catch (error) {
                console.error('Error fetching verification status:', error);
            }
        };

        fetchVerificationStatus();
    }, [customerId, setIsVerified, authData.is_verified]);

    const handleSubmit = async () => {
        if (firstNameValue.trim() === '' || lastNameValue.trim() === '') {
            toast.error('First Name and Last Name cannot be empty');
            return;
        }
        try {
            const updatedCustomer = {
                first_name: firstNameValue,
                last_name: lastNameValue,
                ...(emailValue && { email: emailValue }),
            };
            await updateCustomer(updatedCustomer);
            if (preferred_currency_code) {
                await setCurrency(preferred_currency_code, customerId);
            }
            setIsSubmitted((prev) => !prev); // Toggle the state to trigger useEffect
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    // if (isLoading) {
    //     return (
    //         <Text>
    //             Please refresh the page, an error has occurred loading your
    //             profile...
    //         </Text>
    //     );
    // }
    //
    // if (isError) {
    //     return <Text>Error fetching customer data.</Text>;
    // }

    return (
        <Flex
            flexDirection={'column'}
            width={'100%'}
            gap={'23px'}
            color={'white'}
        >
            <ProfileImage />

            <Text
                fontSize={{ base: '16px', md: '18px' }}
                fontWeight={600}
                color={'primary.indigo.900'}
            >
                Personal Information
            </Text>

            <Flex gap={'15px'} flexDirection={{ base: 'column', md: 'row' }}>
                <ProfileInput
                    placeholder="First Name"
                    label="First Name"
                    value={firstNameValue}
                    setValue={setFirstNameValue}
                />
                <ProfileInput
                    placeholder="Last Name"
                    label="Last Name"
                    value={lastNameValue}
                    setValue={setLastNameValue}
                />
            </Flex>

            <Flex
                mt="-0.5rem"
                flexDirection={{ base: 'column', md: 'row' }}
                gap={'15px'}
            >
                <Flex
                    flexDirection={'column'}
                    width={
                        emailValue?.length > 0
                            ? { base: '100%', md: '50%' }
                            : '100%'
                    }
                >
                    <ProfileCurrency
                        preferred_currency_code={preferred_currency_code}
                        setCustomerPreferredCurrency={
                            setCustomerPreferredCurrency
                        }
                    />
                </Flex>
                {emailValue?.length > 0 && (
                    <Flex
                        flexDirection={'column'}
                        ml="auto"
                        maxW={{ base: '100%', md: '430px' }}
                        width={{ base: '100%', md: '50%' }}
                    >
                        <Text
                            mb={'8px'}
                            textTransform={'uppercase'}
                            fontSize={'12px'}
                            ml={{ base: 0, md: '1rem' }}
                        >
                            Email
                        </Text>

                        <Flex
                            fontSize={{ base: '14px', md: '16px' }}
                            borderRadius={'12px'}
                            height={{ base: '50px', md: '52px' }}
                            backgroundColor={'#020202'}
                            border={'none'}
                            pl="1rem"
                        >
                            <Text alignSelf={'center'} fontSize={'14px'}>
                                {emailValue}
                            </Text>
                        </Flex>
                    </Flex>
                )}
            </Flex>

            <Button
                backgroundColor={'primary.indigo.900'}
                color={'white'}
                borderRadius={'37px'}
                fontSize={{ base: '14px', md: '18px' }}
                fontWeight={600}
                height={{ base: '42px', md: '47px' }}
                width={{ base: '100%', md: '190px' }}
                onClick={handleSubmit}
            >
                Update
            </Button>
        </Flex>
    );
};

export default ProfileForm;
