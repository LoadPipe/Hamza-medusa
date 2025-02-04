'use client';
import React from 'react';
import ItemsTemplate from './items';
import Summary from './summary';
import { CartWithCheckoutStep } from '@/types/global';
import SignInPrompt from '../components/sign-in-prompt';
import Divider from '@modules/common/components/divider';
import { Customer } from '@medusajs/medusa';
import { Flex } from '@chakra-ui/react';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { useQuery } from '@tanstack/react-query';
import { retrieveCart } from '@modules/cart/actions';
const CartTemplate = ({
    cart: initialCart,
    customer,
}: {
    cart: CartWithCheckoutStep | null;
    customer: Omit<Customer, 'password_hash'> | null;
}) => {
    // TODO: Remove this if its not being used...
    // const updateInventory = async (cart: CartWithCheckoutStep) => {
    //     const items = cart.items.map((item) => ({
    //         variant_id: item.variant_id,
    //         quantity: item.quantity,
    //     }));
    //     console.log('ITEMS ARE', items);
    // };

    const { preferred_currency_code, setCustomerPreferredCurrency } =
        useCustomerAuthStore();

    // Use TanStack Query with initialData
    const { data: cart, isFetching } = useQuery({
        queryKey: ['cart'],
        queryFn: retrieveCart,
        initialData: initialCart, // Use SSR-fetched cart
        staleTime: 1000 * 60 * 5, // Keep fresh for 5 minutes
    });

    return (
        <Flex
            maxW={'1280px'}
            width={'100vw'}
            mx="auto"
            py={{ base: '1rem', md: '4rem' }}
            justifyContent="center"
            alignItems={'center'}
        >
            <Flex
                maxWidth="1258px"
                width="100%"
                mx="1rem"
                flexDirection={{ base: 'column', md: 'row' }}
                gap="16px"
            >
                {/* gap="24px" */}
                <Flex flexDirection={'column'} gap="16px" flex={1}>
                    {!customer && (
                        <>
                            <SignInPrompt />
                            <Divider />
                        </>
                    )}
                    {/* Cart Items */}
                    <ItemsTemplate
                        region={cart?.region}
                        items={cart?.items}
                        cart_id={cart?.id as string}
                        currencyCode={preferred_currency_code ?? 'usdc'}
                    />
                    {/* Shipping Address */}
                    {/* <CartShippingAddress customer={customer} /> */}
                </Flex>

                {cart?.items?.length !== 0 && cart?.region && (
                    <Summary cart={cart} />
                )}
            </Flex>
        </Flex>
    );
};

export default CartTemplate;
