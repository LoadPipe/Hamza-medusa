import React from 'react';
import { Flex, Text, Divider, Button } from '@chakra-ui/react';
import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import { LineItem } from '@medusajs/medusa';
import CartTotals from './cart-totals/cart-totals';
import PaymentButton from '@modules/checkout-update-design/components/payment-button';

const PaymentSummary = async (params: any) => {
    const cartId = params.cartId;
    const cart = await retrieveCart(cartId).then((cart) => cart);

    if (!cart) {
        console.log('cart not found');
        return null;
    }

    if (cart?.items.length) {
        const enrichedItems = await enrichLineItems(
            cart?.items,
            cart?.region_id
        );
        cart.items = enrichedItems as LineItem[];
    }

    return (
        <Flex
            bgColor={'#121212'}
            color={'white'}
            maxW={{ base: '100%', md: '401px' }}
            width={'100%'}
            height={{ base: 'auto', md: '540px' }}
            flexDir={'column'}
            borderRadius={'16px'}
            p={{ base: '16px', md: '40px' }}
        >
            <Text
                color={'primary.green.900'}
                fontSize={'18px'}
                fontWeight={600}
            >
                Payment Summary
            </Text>

            <CartTotals data={cart} />

            <Flex mt="auto" flexDir={'column'} gap={5}>
                <PaymentButton cart={cart} />
                <Text
                    textAlign="center"
                    fontSize={{ base: '10px', md: '12px' }}
                    maxW={'236px'}
                    mx="auto"
                >
                    By clicking on confirm order, you agree to these{' '}
                    <Text
                        as="span"
                        color="primary.indigo.900"
                        cursor={'pointer'}
                        opacity={1}
                        _hover={{ opacity: 0.7 }}
                    >
                        {' '}
                        Terms and Conditions.
                    </Text>
                </Text>
            </Flex>
        </Flex>
    );
};

export default PaymentSummary;
