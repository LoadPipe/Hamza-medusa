'use client';

import {
    Button,
    Checkbox,
    Flex,
    FormControl,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { Cart, Customer } from '@medusajs/medusa';
import { setAddresses } from '../../actions';
import CountrySelect from '@modules/checkout/components/country-select';
import { addCustomerShippingAddress } from '@/modules/account/actions';
import { custom } from 'viem';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Omit<Customer, 'password_hash'> | null;
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
    toggleSameAsBilling: () => void;
    countryCode: string;
    selectedAddressId: string;
    addressActionType: 'add' | 'edit';
}

const AddressModal: React.FC<AddressModalProps> = ({
    isOpen,
    onClose,
    customer,
    cart,
    countryCode,
    selectedAddressId,
    addressActionType,
}) => {
    // Save address to address book if radio button clicked
    const [saveAddress, setSaveAddress] = useState(false);

    // Reset the checkbox state to false when the modal opens
    useEffect(() => {
        if (isOpen) {
            setSaveAddress(false);
        }
    }, [isOpen]);

    console.log(cart?.shipping_address);
    console.log(customer?.shipping_addresses);

    const [formData, setFormData] = useState({
        'shipping_address.first_name': cart?.shipping_address?.first_name || '',
        'shipping_address.last_name': cart?.shipping_address?.last_name || '',
        'shipping_address.address_1': cart?.shipping_address?.address_1 || '',
        'shipping_address.address_2': cart?.shipping_address?.address_2 || '',
        'shipping_address.company': cart?.shipping_address?.company || '',
        'shipping_address.postal_code':
            cart?.shipping_address?.postal_code || '',
        'shipping_address.city': cart?.shipping_address?.city || '',
        'shipping_address.country_code':
            cart?.shipping_address?.country_code || countryCode || '',
        'shipping_address.province': cart?.shipping_address?.province || '',
        email: cart?.email || '',
        'shipping_address.phone': cart?.shipping_address?.phone || '',
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLInputElement | HTMLSelectElement
        >
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // When clicked save address on submit
    const handleSaveAddressChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSaveAddress(e.target.checked);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formPayload = new FormData(e.currentTarget);

        // Continue to set the addresses as usual
        await setAddresses(addressActionType, formPayload);
        // If "Save shipping address" checkbox is checked, save the address for the customer
        if (saveAddress) {
            try {
                if (selectedAddressId?.length) {
                    //TODO: yes
                }
                const shippingAddressData = new FormData();
                shippingAddressData.append(
                    'first_name',
                    formData['shipping_address.first_name']
                );
                shippingAddressData.append(
                    'last_name',
                    formData['shipping_address.last_name']
                );
                shippingAddressData.append(
                    'address_1',
                    formData['shipping_address.address_1']
                );
                shippingAddressData.append(
                    'address_2',
                    formData['shipping_address.address_2']
                );
                shippingAddressData.append(
                    'company',
                    formData['shipping_address.company']
                );
                shippingAddressData.append(
                    'postal_code',
                    formData['shipping_address.postal_code']
                );
                shippingAddressData.append(
                    'city',
                    formData['shipping_address.city']
                );
                shippingAddressData.append(
                    'country_code',
                    formData['shipping_address.country_code']
                );
                shippingAddressData.append(
                    'province',
                    formData['shipping_address.province']
                );
                shippingAddressData.append(
                    'phone',
                    formData['shipping_address.phone']
                );

                await addCustomerShippingAddress({}, shippingAddressData);
            } catch (error) {
                console.error('Failed to save shipping address:', error);
            }
        }

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent maxW="737px" maxH="775px" p="6" bgColor={'#121212'}>
                <form onSubmit={handleFormSubmit}>
                    <ModalHeader
                        color={'primary.green.900'}
                        textAlign={'center'}
                        fontSize={'24px'}
                    >
                        Shipping Address
                    </ModalHeader>
                    <ModalCloseButton color={'white'} />
                    <ModalBody>
                        <Flex flexDir="column" gap="8">
                            {/* Name Fields */}
                            <Flex
                                gap="4"
                                flexDir={{ base: 'column', md: 'row' }}
                            >
                                <FormControl isRequired>
                                    <Input
                                        placeholder="First Name"
                                        height={'50px'}
                                        fontSize={'14px'}
                                        bgColor={'#040404'}
                                        borderWidth={0}
                                        borderRadius={'12px'}
                                        name="shipping_address.first_name"
                                        color={'white'}
                                        _placeholder={{ color: 'white' }}
                                        value={
                                            formData[
                                            'shipping_address.first_name'
                                            ]
                                        }
                                        onChange={handleChange}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <Input
                                        placeholder="Last Name"
                                        height={'50px'}
                                        fontSize={'14px'}
                                        bgColor={'#040404'}
                                        borderWidth={0}
                                        borderRadius={'12px'}
                                        name="shipping_address.last_name"
                                        color={'white'}
                                        _placeholder={{ color: 'white' }}
                                        value={
                                            formData[
                                            'shipping_address.last_name'
                                            ]
                                        }
                                        onChange={handleChange}
                                    />
                                </FormControl>
                                <FormControl>
                                    <Input
                                        placeholder="Phone Number"
                                        height={'50px'}
                                        fontSize={'14px'}
                                        bgColor={'#040404'}
                                        borderWidth={0}
                                        borderRadius={'12px'}
                                        name="shipping_address.phone"
                                        color={'white'}
                                        _placeholder={{ color: 'white' }}
                                        value={
                                            formData['shipping_address.phone']
                                        }
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </Flex>

                            {/* Address Fields */}
                            <FormControl isRequired>
                                <Input
                                    placeholder="Address 1"
                                    height={'50px'}
                                    fontSize={'14px'}
                                    bgColor={'#040404'}
                                    borderWidth={0}
                                    borderRadius={'12px'}
                                    name="shipping_address.address_1"
                                    color={'white'}
                                    _placeholder={{ color: 'white' }}
                                    value={
                                        formData['shipping_address.address_1']
                                    }
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <FormControl>
                                <Input
                                    placeholder="Address 2"
                                    height={'50px'}
                                    fontSize={'14px'}
                                    bgColor={'#040404'}
                                    borderWidth={0}
                                    borderRadius={'12px'}
                                    name="shipping_address.address_2"
                                    color={'white'}
                                    _placeholder={{ color: 'white' }}
                                    value={
                                        formData['shipping_address.address_2']
                                    }
                                    onChange={handleChange}
                                />
                            </FormControl>

                            {/* City, State, Country, Zip Code */}
                            <Flex
                                gap="4"
                                flexDir={{ base: 'column', md: 'row' }}
                            >
                                <FormControl isRequired>
                                    <Input
                                        placeholder="City"
                                        bgColor={'#040404'}
                                        height={'50px'}
                                        fontSize={'14px'}
                                        borderWidth={0}
                                        borderRadius={'12px'}
                                        name="shipping_address.city"
                                        color={'white'}
                                        _placeholder={{ color: 'white' }}
                                        value={
                                            formData['shipping_address.city']
                                        }
                                        onChange={handleChange}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <Input
                                        placeholder="State / Province"
                                        height={'50px'}
                                        fontSize={'14px'}
                                        bgColor={'#040404'}
                                        borderWidth={0}
                                        borderRadius={'12px'}
                                        name="shipping_address.province"
                                        color={'white'}
                                        _placeholder={{ color: 'white' }}
                                        value={
                                            formData[
                                            'shipping_address.province'
                                            ]
                                        }
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </Flex>

                            <Flex
                                gap="4"
                                flexDir={{ base: 'column', md: 'row' }}
                            >
                                <FormControl isRequired>
                                    <CountrySelect
                                        className="bg-white"
                                        name="shipping_address.country_code"
                                        autoComplete="country"
                                        region={cart?.region}
                                        color={'white'}
                                        value={
                                            formData[
                                            'shipping_address.country_code'
                                            ]
                                        }
                                        onChange={handleChange}
                                        required
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <Input
                                        placeholder="Zip Code"
                                        height={'50px'}
                                        fontSize={'14px'}
                                        bgColor={'#040404'}
                                        borderWidth={0}
                                        borderRadius={'12px'}
                                        name="shipping_address.postal_code"
                                        color={'white'}
                                        _placeholder={{ color: 'white' }}
                                        value={
                                            formData[
                                            'shipping_address.postal_code'
                                            ]
                                        }
                                        onChange={handleChange}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <Input
                                        name="email"
                                        type="email"
                                        title="Enter a valid email address."
                                        autoComplete="email"
                                        color={'white'}
                                        _placeholder={{ color: 'white' }}
                                        value={
                                            formData.email.includes(
                                                '@evm.blockchain'
                                            )
                                                ? ''
                                                : formData.email
                                        }
                                        onChange={handleChange}
                                        maxLength={50}
                                        placeholder="Email"
                                        height={'50px'}
                                        fontSize={'14px'}
                                        bgColor={'#040404'}
                                        borderWidth={0}
                                        borderRadius={'12px'}
                                    />
                                </FormControl>
                            </Flex>

                            {/* Checkbox for Default Address */}
                            <Flex alignItems="center" my="3" color={'white'}>
                                <Checkbox
                                    mr="2"
                                    isChecked={saveAddress}
                                    onChange={handleSaveAddressChange}
                                />
                                <Text alignSelf={'center'}>
                                    Save address
                                </Text>
                            </Flex>
                        </Flex>
                    </ModalBody>

                    <ModalFooter>
                        <Flex w="100%" gap="4">
                            <Button
                                onClick={onClose}
                                flex="1"
                                variant="outline"
                                borderColor={'primary.indigo.900'}
                                color={'primary.indigo.900'}
                                height={'52px'}
                                borderRadius={'full'}
                                opacity={1}
                                _hover={{ opacity: 0.5 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                colorScheme="blue"
                                backgroundColor={'primary.indigo.900'}
                                flex="1"
                                height={'52px'}
                                borderRadius={'full'}
                                opacity={1}
                                _hover={{ opacity: 0.5 }}
                                type="submit"
                            >
                                Add Address
                            </Button>
                        </Flex>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default AddressModal;
