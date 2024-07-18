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
        <Flex width={'100%'} justifyContent="center" alignItems={'center'}>
            <Flex
                width={'1280px'}
                justifyContent="center"
                alignItems={'center'}
            >
                <Box width="1,258px" pb="5rem" pt="2rem">
                    {cart?.items.length ? (
                        <Flex flexDirection={'row'} gap="26px">
                            <Box
                                width={'825px'}
                                height={'540px'}
                                borderRadius={'16px'}
                                backgroundColor={'#121212'}
                                px="40px"
                                py="10px"
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
                                <ItemsTemplate
                                    region={cart?.region}
                                    items={cart?.items}
                                />
                            </Box>

                            <Box>
                                {cart && cart.region && <Summary cart={cart} />}
                            </Box>
                        </Flex>
                    ) : (
                        <div>
                            <EmptyCartMessage />
                        </div>
                    )}
                </Box>
            </Flex>
        </Flex>
    );
};

export default CartTemplate;
