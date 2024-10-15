import Addresses from '@modules/checkout/components/addresses';
import Shipping from '@modules/checkout/components/shipping';
import Payment from '@modules/checkout/components/payment';
import Review from '@modules/checkout/components/review';
import {
    createPaymentSessions,
    getHamzaCustomer,
    listShippingMethods,
} from '@lib/data';
import { cookies } from 'next/headers';
import { Button, Flex, Text } from '@chakra-ui/react';
import { CartWithCheckoutStep } from 'types/global';
import { getCheckoutStep } from '@lib/util/get-checkout-step';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import ChevronDown from '@modules/common/icons/chevron-down';
import { MdChevronLeft } from 'react-icons/md';

export default async function CheckoutForm(params: any) {
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
    console.log(cart.checkout_step);

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
        <div>
            <div className="w-full grid grid-cols-1 gap-y-8">
                <LocalizedClientLink
                    href="/cart"
                    className="flex flex-1 basis-0"
                >
                    <Flex
                        height={'52px'}
                        flexDirection={'row'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        mt={'auto'}
                        color="white"
                        _hover={{
                            color: 'primary.green.900',
                            transition: 'color 0.2s ease-in-out',
                        }}
                    >
                        <Flex
                            alignSelf={'center'}
                            flexDirection={'row'}
                            my="auto"
                        >
                            <MdChevronLeft size={40} />
                            <Text
                                alignSelf={'center'}
                                display={{ base: 'none', md: 'block' }}
                            >
                                Back to shopping cart
                            </Text>
                        </Flex>
                    </Flex>
                </LocalizedClientLink>
                <div>
                    <Addresses cart={cart} customer={customer} />
                </div>

                <div>
                    <Shipping
                        cart={cart}
                        availableShippingMethods={availableShippingMethods}
                    />
                </div>

                <div>
                    <Payment cart={cart} />
                </div>

                <div>
                    <Review cart={cart} />
                </div>
            </div>
        </div>
    );
}
