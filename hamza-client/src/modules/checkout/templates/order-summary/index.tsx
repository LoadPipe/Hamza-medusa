'use client';
import { Flex, Text, Button, Link, Divider } from '@chakra-ui/react';
import { Cart } from '@medusajs/medusa';
import CartItems from '@modules/checkout/components/cart-items';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import React from 'react';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { useQuery } from '@tanstack/react-query';
import { fetchCart } from '@/app/[countryCode]/(checkout)/checkout/utils/fetch-cart';

const OrderSummary = ({ cartId }: { cartId: string }) => {
    const { preferred_currency_code } = useCustomerAuthStore();
    const { data: cart } = useQuery({
        queryKey: ['cart', cartId],
        queryFn: () => fetchCart(cartId),
        staleTime: 1000 * 60 * 5,
        enabled: !!cartId,
    });
    const isCartEmpty = !cart?.items || cart.items.length === 0;
    return (
        <Flex
            bgColor={'#121212'}
            maxW={'825px'}
            width={'100%'}
            height={'auto'}
            flexDir={'column'}
            borderRadius={'16px'}
            px={{ base: '16px', md: '60px' }}
            py={{ base: '16px', md: '40px' }}
        >
            <Text
                color={'primary.green.900'}
                fontSize={'18px'}
                fontWeight={600}
            >
                Order Summary
            </Text>

            {isCartEmpty ? (
                // Empty cart template
                <Flex
                    mt="1rem"
                    width={'100%'}
                    flexDir={'column'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    color={'white'}
                >
                    <Divider borderColor="#3E3E3E" borderWidth={'1px'} />
                    <Flex
                        mt={{ base: '0', md: '3.5rem' }}
                        maxW={'329px'}
                        height={{ base: '170px', md: '273px' }}
                        width={'100%'}
                        flexDir={'column'}
                        gap={{ base: 3, md: 30 }}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <Flex
                            flexDir={'column'}
                            mt={{ base: '0', md: '-1rem' }}
                            gap={{ base: 0, md: '8px' }}
                        >
                            <Flex
                                fontSize={{ base: '26px', md: '56px' }}
                                alignSelf={'center'}
                                mb="0.25rem"
                            >
                                <HiOutlineShoppingCart />
                            </Flex>
                            <Text
                                textAlign={'center'}
                                fontSize={{ base: '14px', md: '20px' }}
                                fontWeight={600}
                                color="primary.green.900"
                            >
                                Your cart is empty
                            </Text>
                            <Text
                                fontSize={{ base: '14px', md: '16px' }}
                                textAlign={'center'}
                            >
                                Looks like you haven't added anything to your
                                cart yet.
                            </Text>
                        </Flex>
                        <Link
                            href={'/shop'}
                            textAlign={'center'}
                            width={'100%'}
                        >
                            <Button
                                backgroundColor={'primary.green.900'}
                                color="black"
                                width={{ base: '100%', md: '174px' }}
                                borderRadius={'30px'}
                                height={{ base: '42px', md: '52px' }}
                                fontSize={{ base: '14px', md: '16px' }}
                            >
                                Start Shopping
                            </Button>
                        </Link>
                    </Flex>
                </Flex>
            ) : (
                // Cart items template
                <CartItems
                    cart={cart}
                    region={cart?.region}
                    items={cart?.items}
                    currencyCode={preferred_currency_code ?? 'usdc'}
                />
            )}
        </Flex>
    );
};

export default OrderSummary;
