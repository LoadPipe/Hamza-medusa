'use client';

import { Flex, Text, Spinner } from '@chakra-ui/react';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import React from 'react';
import ForceWalletConnect from '@modules/common/components/force-wallet-connect';
import { useDelayedAuthCheck } from '@modules/common/components/force-wallet-connect/components/useDelayedAuthCheck';
import { CartWithCheckoutStep } from '@/types/global';
import { organizeCartItemsByStore } from '@/app/[countryCode]/(main)/cart/utils/fetch-cart-for-cart';
import EmptyCart from '@/modules/cart/components/empty-cart';
import StoreItems from '@/modules/cart/components/store-items';
import { useCartStore } from '@/zustand/cart-store/cart-store';
const OrderSummary = ({ cart }: { cart: CartWithCheckoutStep }) => {
    const { isProcessingOrder } = useCartStore();
    const { preferred_currency_code } = useCustomerAuthStore();

    // State to control delay for showing ForceWalletConnect
    const { isAuthenticated, showAuthCheck } = useDelayedAuthCheck();
    // If the delay has passed and the user is NOT logged in, show ForceWalletConnect
    if (showAuthCheck && !isAuthenticated) {
        return <ForceWalletConnect />;
    }

    const stores = organizeCartItemsByStore(cart as CartWithCheckoutStep);

    if (isProcessingOrder) {
        return <Spinner />;
    }

    return (
        <Flex
            bgColor={'#121212'}
            maxW={'825px'}
            width={'100%'}
            height={'auto'}
            flexDir={'column'}
            borderRadius={'16px'}
            px={{ base: '16px', md: '60px' }}
            py={{ base: '16px', md: '40px' }}
        >
            <Text
                color={'primary.green.900'}
                fontSize={'18px'}
                fontWeight={600}
            >
                Order Summary
            </Text>

            {cart?.items && cart?.items.length > 0 && cart?.region ? (
                <>
                    {stores.map((store) => (
                        <StoreItems
                            key={store.id}
                            store={store}
                            cart={cart}
                            currencyCode={preferred_currency_code ?? 'usdc'}
                        />
                    ))}
                </>
            ) : (
                <EmptyCart />
            )}
        </Flex>
    );
};

export default OrderSummary;
