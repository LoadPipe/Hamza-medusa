'use client';
import React, { useEffect } from 'react';
import ItemsTemplate from './items-template';
import Summary from './summary';
import SignInPrompt from '../components/sign-in-prompt';
import Divider from '@modules/common/components/divider';
import { Cart, Customer } from '@medusajs/medusa';
import { Flex } from '@chakra-ui/react';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCartForCart } from '@/app/[countryCode]/(main)/cart/utils/fetch-cart-for-cart';
import { CartWithCheckoutStep } from '@/types/global';

/**
 * @param initialCart - CartWithCheckoutStep | null (if initialCart prop changes and ANY re-renders
 * that change isn't reflected in the cart state since initialCart is only used to set the initial value)
 * So we won't be using initialCart to get data into the cache.
 * @Author Garo
 * @What: `What if instead of fetching on the server and sending that data to the client,
 * we fetch on the server, add it to the cache, and then send the whole cache to the client to hydrate?`
 * @API's: `dehydrate` `HydrationBoundary`
 */
const CartTemplate = ({
    customer,
    cart,
}: {
    customer: Omit<Customer, 'password_hash'> | null;
    cart: CartWithCheckoutStep;
}) => {
    const { preferred_currency_code, setCustomerPreferredCurrency } =
        useCustomerAuthStore();
    const queryClient = useQueryClient();

    const {
        data: initialCart,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['cart'],
        queryFn: fetchCartForCart,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
    }, []);

    if (isLoading) {
        return <p>Loading cart...</p>; // ✅ Better UX
    }

    if (isError) {
        return <p>Error loading cart. Please try again.</p>; // ✅ Handle errors
    }

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
                        currencyCode={preferred_currency_code ?? 'usdc'}
                        cart={initialCart as CartWithCheckoutStep}
                    />
                    {/* Shipping Address */}
                    {/* <CartShippingAddress customer={customer} /> */}
                </Flex>

                {initialCart?.items?.length !== 0 && initialCart?.region && (
                    <Summary />
                )}
            </Flex>
        </Flex>
    );
};

export default CartTemplate;
