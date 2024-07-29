'use client';
import React from 'react';
import ItemsTemplate from './items';
import Summary from './summary';
import EmptyCartMessage from '../components/empty-cart-message';
import { CartWithCheckoutStep } from 'types/global';
import SignInPrompt from '../components/sign-in-prompt';
import Divider from '@modules/common/components/divider';
import { Customer } from '@medusajs/medusa';
import { Box, Flex, Text } from '@chakra-ui/react';

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
            width={'1280px'}
            mx="auto"
            justifyContent="center"
            alignItems={'center'}
        >
            {cart?.items.length ? (
                <Box width="1,258px" pb="5rem" pt="2rem">
                    <Flex flexDirection={'row'} gap="32px">
                        <Flex flexDirection={'column'} gap="32px">
                            <Flex
                                width={'825px'}
                                borderRadius={'16px'}
                                backgroundColor={'#121212'}
                                px="40px"
                                py="10px"
                                justifyContent="center"
                            >
                                <Flex
                                    maxW={'705px'}
                                    height={'460px'}
                                    width={'100%'}
                                    flexDirection={'column'}
                                >
                                    {!customer && (
                                        <>
                                            <SignInPrompt />
                                            <Divider />
                                        </>
                                    )}
                                    <Text
                                        mt="1rem"
                                        fontWeight={600}
                                        fontSize={'18px'}
                                        color="primary.green.900"
                                    >
                                        Product Details
                                    </Text>
                                    {/* Cart Items */}
                                    <ItemsTemplate
                                        region={cart?.region}
                                        items={cart?.items}
                                    />
                                </Flex>
                            </Flex>

                            {/* Shipping Address */}
                            <Box
                                width={'825px'}
                                height={'240px'}
                                borderRadius={'16px'}
                                backgroundColor={'#121212'}
                            >
                                <Text
                                    mt="1rem"
                                    fontWeight={600}
                                    fontSize={'18px'}
                                    color="primary.green.900"
                                >
                                    Shipping Address
                                </Text>
                            </Box>
                        </Flex>

                        <Box>
                            {cart && cart.region && <Summary cart={cart} />}
                        </Box>
                    </Flex>
                </Box>
            ) : (
                <div>
                    <EmptyCartMessage />
                </div>
            )}
        </Flex>
    );
};

export default CartTemplate;
