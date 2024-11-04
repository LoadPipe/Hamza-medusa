'use client';

import { useParams, useRouter } from 'next/navigation';
import { Cart, Customer } from '@medusajs/medusa';
import { useToggleState } from '@medusajs/ui';
import { Flex, Text, useDisclosure, Button } from '@chakra-ui/react';
import compareAddresses from '@lib/util/compare-addresses';
import { BiPencil } from 'react-icons/bi';
import AddressModal from '../address-modal';
import { IoLocationOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';

const Addresses = ({
    cart,
    customer,
}: {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
    customer: Omit<Customer, 'password_hash'> | null;
}) => {
    const router = useRouter();

    // Hooks to open and close address modal
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [shippingAddressType, setShippingAddressType] = useState<
        'add' | 'edit'
    >('add');

    // Get country code
    const params = useParams();
    const countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY
        ? process.env.NEXT_PUBLIC_FORCE_COUNTRY
        : (params.countryCode as string);

    // Set contact email on shipping address display
    const contactEmail = cart?.email
        ? cart.email.endsWith('@evm.blockchain')
            ? ''
            : cart.email
        : '';

    const { state: sameAsSBilling, toggle: toggleSameAsBilling } =
        useToggleState(
            cart?.shipping_address && cart?.billing_address
                ? compareAddresses(
                      cart?.shipping_address,
                      cart?.billing_address
                  )
                : true
        );

    const handleAddAddress = () => {
        setShippingAddressType('add');
        onOpen();
    };

    const handleEditAddress = () => {
        setShippingAddressType('edit');
        onOpen();
    };

    useEffect(() => {
        if (cart?.customer_id && cart?.shipping_address) {
            router.push('/checkout?step=review');
        }
    }, [cart, router]);

    return (
        <div>
            <Flex mt="2rem" width={'100%'} flexDir={'row'}>
                <Text
                    color={'primary.green.900'}
                    fontSize={{ base: '16px', md: '18px' }}
                    fontWeight={600}
                >
                    Shipping To:
                </Text>
                <Flex
                    flexDir={'row'}
                    cursor={'pointer'}
                    ml="auto"
                    alignSelf={'center'}
                    color="white"
                    _hover={{ color: 'primary.green.900' }}
                    onClick={onOpen}
                    gap={2}
                >
                    <BiPencil size={23} />
                </Flex>
            </Flex>

            <div>
                {cart && cart.shipping_address ? (
                    <Flex flexDir={'column'} color="white">
                        <Text
                            fontWeight={700}
                            fontSize={{ base: '14px', md: '16px' }}
                        >
                            {cart.shipping_address.first_name}{' '}
                            {cart.shipping_address.last_name}
                        </Text>
                        <Text fontSize={{ base: '14px', md: '16px' }}>
                            {cart.shipping_address.address_1}{' '}
                            {cart.shipping_address.address_2}
                        </Text>
                        <Text fontSize={{ base: '14px', md: '16px' }}>
                            {cart.shipping_address.postal_code},{' '}
                            {cart.shipping_address.city}
                        </Text>
                        <Text fontSize={{ base: '14px', md: '16px' }}>
                            {cart.shipping_address.country_code?.toUpperCase()}
                        </Text>
                        <Text fontSize={{ base: '14px', md: '16px' }}>
                            {contactEmail}
                        </Text>

                        <Flex
                            mt="2rem"
                            flexDir={{ base: 'column', md: 'row' }}
                            gap={{ base: 4, md: 5 }}
                            mb={{ base: '0.5rem', md: 0 }}
                        >
                            <Button
                                leftIcon={<IoLocationOutline size={20} />}
                                flex={{ base: 'unset', md: 1 }}
                                borderRadius={'full'}
                                height={{ base: '42px', md: '52px' }}
                                borderWidth={'1px'}
                                borderColor={'primary.indigo.900'}
                                color={'primary.indigo.900'}
                                backgroundColor={'transparent'}
                                opacity={1}
                                _hover={{
                                    opacity: 0.5,
                                }}
                                onClick={handleEditAddress}
                            >
                                Edit Shipping Address
                            </Button>
                        </Flex>
                    </Flex>
                ) : (
                    <Flex
                        mt="2rem"
                        flexDir={{ base: 'column', md: 'row' }}
                        gap={{ base: 4, md: 5 }}
                    >
                        <Button
                            leftIcon={<IoLocationOutline size={20} />}
                            flex={{ base: 'unset', md: 1 }}
                            borderRadius={'full'}
                            height={{ base: '42px', md: '52px' }}
                            borderWidth={'1px'}
                            borderColor={'primary.indigo.900'}
                            color={'primary.indigo.900'}
                            backgroundColor={'transparent'}
                            opacity={1}
                            _hover={{
                                opacity: 0.5,
                            }}
                            onClick={handleAddAddress}
                        >
                            Add Shipping Address
                        </Button>
                    </Flex>
                )}
            </div>
            <AddressModal
                customer={customer}
                countryCode={countryCode}
                toggleSameAsBilling={toggleSameAsBilling}
                cart={cart}
                isOpen={isOpen}
                onClose={onClose}
                addressType={shippingAddressType}
            />
        </div>
    );
};

export default Addresses;
