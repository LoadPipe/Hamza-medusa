'use client';

import { Button, Text, Flex } from '@chakra-ui/react';
import CartTotals from '@modules/common/components/cart-totals';
import { CartWithCheckoutStep } from '@/types/global';
import DiscountCode from '@modules/checkout/components/discount-code';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import Spinner from '@modules/common/icons/spinner';
import { useCartStore } from '@/zustand/cart-store/cart-store';
import { useQuery } from '@tanstack/react-query'; // Import Zustand store
import { fetchCartForCart } from '@/app/[countryCode]/(main)/cart/utils/fetch-cart-for-cart';


const Summary = () => {

    const { data: cart } = useQuery({
        queryKey: ['cart'],
        queryFn: fetchCartForCart,
        staleTime: 1000 * 60 * 5,
    });

    const isUpdating = useCartStore((state) => state.isUpdating);

    return (
        <Flex
            flexDir={'column'}
            p={{ base: '16px', md: '40px' }}
            height="auto"
            alignSelf="flex-start"
            maxW={{ base: '100%', md: '401px' }}
            width={'100%'}
            backgroundColor={'#121212'}
            borderRadius={'16px'}
        >
            <Text
                color="primary.green.900"
                fontSize={{ base: '16px', md: '18px' }}
                fontWeight={700}
                mb="1rem"
            >
                Summary
            </Text>
            <CartTotals useCartStyle={false} />
            <DiscountCode />
            <LocalizedClientLink href={'/checkout?step=' + cart?.checkout_step}>
                <Button
                    mt="2rem"
                    backgroundColor={'primary.indigo.900'}
                    color={'white'}
                    width={'100%'}
                    height={{ base: '42px', md: '52px' }}
                    borderRadius={'full'}
                    fontSize={{ base: '14px', md: '16px' }}
                    isDisabled={cart?.items?.length === 0 || isUpdating}
                    _hover={{
                        backgroundColor: 'white',
                        color: 'black',
                    }}
                >
                    {isUpdating ? <Spinner /> : 'Checkout Now'}
                </Button>
            </LocalizedClientLink>
        </Flex>
    );
};

export default Summary;
