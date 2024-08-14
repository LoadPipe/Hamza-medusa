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
        <Box width={'100%'}>
            <Text
                color="primary.green.900"
                fontSize={'18px'}
                fontWeight={700}
                mb="1rem"
            >
                Summary
            </Text>
            <CartTotals data={cart} />
            <DiscountCode cart={cart} />
            <LocalizedClientLink href={'/checkout?step=' + cart.checkout_step}>
                <Button
                    mt="2rem"
                    backgroundColor={'primary.indigo.900'}
                    color={'white'}
                    width={'100%'}
                    height={'52px'}
                    borderRadius={'full'}
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
