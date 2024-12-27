import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import Addresses from '@modules/checkout/components/addresses';
import { CartWithCheckoutStep } from '@/types/global';
import { getCheckoutStep } from '@lib/util/get-checkout-step';
import {
    createPaymentSessions,
    getHamzaCustomer,
    listShippingMethods,
} from '@lib/data';
import { redirect } from 'next/navigation';
import { SwitchNetwork } from '@/app/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';

export default async function CheckoutDetails(params: any) {
    const cartId = params.cartId;

    if (!cartId) {
        return null;
    }

    // create payment sessions and get cart
    const cart = (await createPaymentSessions(cartId).then(
        (cart) => cart
    )) as CartWithCheckoutStep;

    if (!cart) {
        return null;
    }

    cart.checkout_step = cart && getCheckoutStep(cart);

    // get available shipping methods
    const availableShippingMethods = await listShippingMethods(
        cart.region_id
    ).then((methods) => methods?.filter((m) => !m.is_return));

    if (!availableShippingMethods) {
        return null;
    }

    // get customer if logged in
    const customer = await getHamzaCustomer();

    return (
        <Flex
            bgColor={'#121212'}
            maxW={'825px'}
            width={'100%'}
            height={{ base: 'auto', md: '406px' }}
            flexDir={'column'}
            borderRadius={'16px'}
            px={{ base: '16px', md: '60px' }}
            py={{ base: '16px', md: '40px' }}
        >
            <Text
                color={'primary.green.900'}
                fontSize={'18px'}
                // textAlign={{ base: 'center', md: 'unset' }}
                fontWeight={600}
            >
                Checkout Details
            </Text>

            <Addresses cart={cart} customer={customer} />
        </Flex>
    );
}
