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
import { setAddresses, setAddresses2 } from '@modules/checkout/actions';
import CountrySelect from '@modules/checkout/components/country-select';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    customer: Omit<Customer, 'password_hash'> | null;
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
    checked: boolean;
    onChange: () => void;
    countryCode: string;
}

const AddressModal: React.FC<AddressModalProps> = ({
    isOpen,
    onClose,
    customer,
    cart,
    checked,
    onChange,
    countryCode,
}) => {
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

    // TODO (For G), take a look at what obj / type we are sending instead of passing any
    const countriesInRegion = useMemo(
        () => cart?.region.countries.map((c: any) => c.iso_2),
        [cart?.region]
    );

    // check if customer has saved addresses that are in the current region
    const addressesInRegion = useMemo(
        () =>
            customer?.shipping_addresses?.filter(
                (a) =>
                    a.country_code &&
                    countriesInRegion?.includes(a.country_code)
            ),
        [customer?.shipping_addresses, countriesInRegion]
    );

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formPayload = new FormData(e.currentTarget);
        setAddresses2(formPayload);
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
                                <FormControl isRequired>
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
                                        _placeholder={{ color: 'white' }}
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
                                    isChecked={checked}
                                    onChange={onChange}
                                />
                                <Text alignSelf={'center'}>
                                    Set address as default
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
