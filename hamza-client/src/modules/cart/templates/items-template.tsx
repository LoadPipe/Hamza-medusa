import { Box, Flex, Text, Button, Link, Divider } from '@chakra-ui/react';
import { LineItem, Region } from '@medusajs/medusa';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import Item from '@modules/cart/components/item';
import { useQuery } from '@tanstack/react-query';
import { fetchCartForCart } from '@/app/[countryCode]/(main)/cart/utils/fetch-cart-for-cart';
import React from 'react';

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type ItemsTemplateProps = {
    currencyCode?: string;
};

const ItemsTemplate = ({ currencyCode }: ItemsTemplateProps) => {
    const { data: cart } = useQuery({
        queryKey: ['cart'],
        queryFn: fetchCartForCart,
        staleTime: 1000 * 60 * 5,
    });

    // TODO: We're repeating this in the child component...
    if (!cart || !cart.items) return;

    return (
        <Flex
            flexDir={'column'}
            maxW={cart.items && cart.items.length > 0 ? '830px' : '100%'}
            width={'100%'}
            height={'auto'}
            alignSelf={'self-start'}
            py={{ base: '16px', md: '40px' }}
            px={{ base: '16px', md: '45px' }}
            borderRadius={'16px'}
            backgroundColor={'#121212'}
            color={'white'}
        >
            <Flex justifyContent={{ base: 'center', md: 'left' }}>
                {/* <Radio mr="2rem" display={{ base: 'none', md: 'flex' }} /> */}
                <Text
                    fontWeight={600}
                    fontSize={{ base: '16px', md: '18px' }}
                    color="primary.green.900"
                >
                    Product Details
                </Text>
            </Flex>
            <Box mt="1rem" minHeight={{ base: '170px', md: '400px' }}>
                {cart.items && cart.items.length > 0 && cart.region ? (
                    cart.items
                        .sort((a, b) => {
                            return a.created_at > b.created_at ? -1 : 1;
                        })
                        .map((item) => {
                            return (
                                <Item
                                    key={item.id}
                                    item={item}
                                    region={cart.region}
                                    cart_id={cart.id}
                                    currencyCode={currencyCode}
                                />
                            );
                        })
                ) : (
                    <Flex
                        width={'100%'}
                        flexDir={'column'}
                        justifyContent={'center'}
                        alignItems={'center'}
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
                                    Looks like you haven't added anything to
                                    your cart yet.
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
                )}
            </Box>
        </Flex>
    );
};

export default ItemsTemplate;
