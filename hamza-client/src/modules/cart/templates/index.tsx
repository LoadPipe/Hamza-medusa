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
                        <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
                            <div className="flex flex-col bg-black py-6 gap-y-6 text-white">
                                {!customer && (
                                    <>
                                        <SignInPrompt />
                                        <Divider />
                                    </>
                                )}
                                <Text
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
                            </div>
                            <div className="relative">
                                <div className="flex flex-col gap-y-8 sticky top-12 bg-black text-white">
                                    {cart && cart.region && (
                                        <>
                                            <div className="bg-black py-6 text-white">
                                                <Summary cart={cart} />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
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
