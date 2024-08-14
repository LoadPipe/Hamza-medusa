'use client';

import { Heading } from '@medusajs/ui';
import { Button, Box, Text } from '@chakra-ui/react';
import CartTotals from '@modules/common/components/cart-totals';
import Divider from '@modules/common/components/divider';
import { CartWithCheckoutStep } from 'types/global';
import DiscountCode from '@modules/checkout/components/discount-code';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

type SummaryProps = {
    cart: CartWithCheckoutStep;
};

const Summary = ({ cart }: SummaryProps) => {
    return (
        <Box
            width={'100vw'}
            backgroundColor={'#121212'}
            p="40px"
            borderRadius={'16px'}
        >
            <Text color={'primary.green.900'}>Enter your email</Text>
            {/* <Heading level="h2" className="text-[2rem] leading-[2.75rem]">
                Summary
            </Heading> */}
            <DiscountCode cart={cart} />
            <Divider />
            <CartTotals data={cart} />
            <LocalizedClientLink href={'/checkout?step=' + cart.checkout_step}>
                <Button
                    backgroundColor={'primary.indigo.900'}
                    color={'white'}
                    width={'100%'}
                    height={'52px'}
                    fontSize={'16px'}
                    _hover={{
                        backgroundColor: 'white',
                        color: 'black',
                    }}
                >
                    Checkout Now
                </Button>
            </LocalizedClientLink>
        </Box>
    );
};

export default Summary;
