'use client';
import React, { useState } from 'react';
import ItemsTemplate from './items';
import Summary from './summary';
import EmptyCartMessage from '../components/empty-cart-message';
import { CartWithCheckoutStep } from 'types/global';
import SignInPrompt from '../components/sign-in-prompt';
import Divider from '@modules/common/components/divider';
import { Customer } from '@medusajs/medusa';
import { Box, Flex, Text } from '@chakra-ui/react';
import CartShippingAddress from '../components/address';

const CartTemplate = ({
    cart,
    customer,
}: {
    cart: CartWithCheckoutStep | null;
    customer: Omit<Customer, 'password_hash'> | null;
}) => {
    const updateInventory = async (cart: CartWithCheckoutStep) => {
        const items = cart.items.map((item) => ({
            variant_id: item.variant_id,
            quantity: item.quantity,
        }));
        console.log('ITEMS ARE', items);
    };

    // Ensure `cart` is not null before calling `updateInventory`
    const handleUpdateInventory = () => {
        if (cart) {
            updateInventory(cart);
        }
    };

    return (
        <Flex
            maxW={'1280px'}
            width={'100vw'}
            mx="auto"
            py={{ base: '1rem', md: '4rem' }}
            justifyContent="center"
            alignItems={'center'}
        >
            {cart?.items.length ? (
                <Flex
                    maxWidth="1258px"
                    width="100%"
                    mx="1rem"
                    flexDirection={{ base: 'column', md: 'row' }}
                    gap="16px"
                >
                    {/* gap="24px" */}
                    <Flex flexDirection={'column'} gap="16px" flex={1}>
                        {/* {!customer && (
                                    <>
                                        <SignInPrompt />
                                        <Divider />
                                    </>
                                )} */}
                        {/* Cart Items */}
                        <ItemsTemplate
                            region={cart?.region}
                            items={cart?.items}
                        />

                        {/* Shipping Address */}

                        <CartShippingAddress customer={customer} />
                    </Flex>

                    {cart && cart.region && <Summary cart={cart} />}
                </Flex>
            ) : (
                <div>
                    <EmptyCartMessage />
                </div>
            )}
        </Flex>
    );
};

export default CartTemplate;
