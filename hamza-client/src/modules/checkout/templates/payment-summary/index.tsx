import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import { LineItem } from '@medusajs/medusa';
import CartTotals from '@modules/common/components/cart-totals';
import DiscountCode from '@modules/checkout/components/discount-code';
import PaymentButton from '@modules/checkout/components/payment-button';
import CheckoutTermsOfService from '@/modules/terms-of-service/templates/checkout-tos';

const PaymentSummary = async ({ cartId }: { cartId: string }) => {
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
            minHeight={{ base: 'auto', md: '400px' }}
            maxHeight={{ base: 'auto', md: '580px' }}
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

            <CartTotals cartId={cartId} useCartStyle={true} />

            <Flex mt="auto" flexDir={'column'} gap={5}>
                <DiscountCode cartId={cartId} />
                <PaymentButton cart={cart} />
                {/* <Text
                    textAlign="center"
                    fontSize={{ base: '10px', md: '12px' }}
                    maxW={'236px'}
                    mx="auto"
                >
                    By clicking on confirm order, you agree to these{' '}
                    <CheckoutTermsOfService />
                </Text> */}
            </Flex>
        </Flex>
    );
};

export default PaymentSummary;
