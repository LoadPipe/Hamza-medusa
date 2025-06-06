'use client';

import { useParams, useRouter } from 'next/navigation';
import { Customer } from '@medusajs/medusa';
import { useToggleState } from '@medusajs/ui';
import { Flex, Text, useDisclosure, Button, Spinner } from '@chakra-ui/react';
import compareAddresses from '@lib/util/compare-addresses';
import { BiPencil } from 'react-icons/bi';
import AddressModal from '../address-modal';
import { IoLocationOutline } from 'react-icons/io5';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCartForCart } from '@/app/[countryCode]/(main)/cart/utils/fetch-cart-for-cart';
import { CartWithCheckoutStep } from '@/types/global';
import { useCartStore } from '@/zustand/cart-store/cart-store';

//TODO: we need a global common function to replace this
const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

const Addresses = ({
    cart: initialCart,
    customer,
}: {
    cart: CartWithCheckoutStep | null;
    customer: Omit<Customer, 'password_hash'> | null;
}) => {
    // Use TanStack Query to fetch cart data
    const { data: cart } = useQuery({
        queryKey: ['cart', initialCart?.id],
        queryFn: fetchCartForCart,
        staleTime: 0,
        gcTime: 0,
        initialData: initialCart,
    });

    const isUpdatingCart = useCartStore((state) => state.isUpdatingCart);

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

    const { toggle: toggleSameAsBilling } = useToggleState(
        cart?.shipping_address && cart?.billing_address
            ? compareAddresses(cart?.shipping_address, cart?.billing_address)
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

    // useEffect(() => {
    //     const updateShippingMethod = async () => {
    //         if (cart?.customer_id && cart?.shipping_address) {
    //             console.log('Checking shipping method in address');
    //             console.log('Shipping methods:', cart?.shipping_methods);

    //             if (!cart?.shipping_methods || !cart?.shipping_methods.length) {
    //                 // If no shipping methods, add the default shipping method
    //                 console.log('Adding default shipping method');
    //                 axios.put(
    //                     `${MEDUSA_SERVER_URL}/custom/cart/shipping`,
    //                     {
    //                         cart_id: cart.id,
    //                     },
    //                     {
    //                         headers: {
    //                             authorization: getClientCookie('_medusa_jwt'),
    //                         },
    //                     }
    //                 );
    //             }
    //         }
    //     };

    //     updateShippingMethod();
    // }, [cart]);

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
                {isUpdatingCart ? (
                    <Flex>
                        <Text color="white" py={6}>
                            <Spinner /> Address loading...
                        </Text>
                    </Flex>
                ) : cart && cart.shipping_address ? (
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
                            {cart.shipping_address.province},{' '}
                            {cart.shipping_address.city}
                        </Text>
                        <Text fontSize={{ base: '14px', md: '16px' }}>
                            {cart.shipping_address.postal_code},{' '}
                            {cart.shipping_address.country_code?.toUpperCase()}
                        </Text>
                        <Text fontSize={{ base: '14px', md: '16px' }}>
                            {cart.shipping_address.phone}
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
