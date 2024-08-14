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
                >
                    {/* gap="24px" */}
                    <Flex flexDirection={'column'} flex={1} gap="24px">
                        <Flex
                            maxW={'830px'}
                            width={'100%'}
                            height={'520px'}
                            borderRadius={'16px'}
                            backgroundColor={'#121212'}
                            justifyContent="center"
                            alignItems={'center'}
                        >
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
                        </Flex>

                        {/* Shipping Address */}
                        <Flex
                            maxWidth={'825px'}
                            width={'100%'}
                            height={'240px'}
                            borderRadius={'16px'}
                            backgroundColor={'#121212'}
                        >
                            <CartShippingAddress customer={customer} />
                        </Flex>
                    </Flex>

                    <Flex
                        mt={{ base: '1rem', md: '0' }}
                        maxW={{ base: '100%', md: '401px' }}
                        width={'100%'}
                        height={'450px'}
                        ml={{ base: '0', md: 'auto' }}
                    >
                        {cart && cart.region && <Summary cart={cart} />}
                    </Flex>
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
