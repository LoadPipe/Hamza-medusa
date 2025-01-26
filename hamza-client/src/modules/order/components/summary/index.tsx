'use client';
import React from 'react';
import { Flex, Text, Divider } from '@chakra-ui/react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import Thumbnail from '@modules/products/components/thumbnail';
// import Tweet from '@/components/tweet';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import Image from 'next/image';
import currencyIcons from '../../../../../public/images/currencies/crypto-currencies';
import { Cart } from '@medusajs/medusa';

type SummaryProps = {
    cart: Cart;
};

const Summary: React.FC<SummaryProps> = ({ cart }) => {
    return (
        <Flex direction="column" width="100%">
            <Text fontWeight={600} mb="1rem">
                Your Order
            </Text>

            {/* Cart Items */}
            {cart.items.map((item, index) => (
                <Flex key={item.id} direction="column" width="100%">
                    <Divider
                        mt="1rem"
                        mb="0.5rem"
                        display={index !== 0 ? 'flex' : 'none'}
                        borderColor="#555555"
                    />
                    <Flex mt="1rem" height="70px" width="100%">
                        <Flex flexDir="column">
                            <LocalizedClientLink
                                href={`/products/${item.variant.product.handle}`}
                            >
                                <Flex width="55px" height="55px">
                                    <Thumbnail
                                        thumbnail={item.thumbnail}
                                        images={[]}
                                        size="small"
                                    />
                                </Flex>
                            </LocalizedClientLink>
                        </Flex>
                        <Flex flexDir={'column'}>
                            <Text
                                ml="1rem"
                                maxW={{ base: '200px', md: '336px' }}
                                height="46px"
                                width="100%"
                                fontSize={{ base: '14px', md: '16px' }}
                                noOfLines={2}
                            >
                                {item.title}
                            </Text>
                        </Flex>
                        <Flex ml="auto">
                            <Flex height="22px" alignItems="center" mb="auto">
                                <Image
                                    className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                                    src={
                                        currencyIcons[
                                            item.currency_code ?? 'usdc'
                                        ]
                                    }
                                    alt={item.currency_code ?? 'usdc'}
                                />
                            </Flex>
                            <Flex height="22px" alignItems="center" mb="auto">
                                <Text
                                    ml="0.4rem"
                                    alignSelf="center"
                                    fontSize={{ base: '14px', md: '16px' }}
                                >
                                    {formatCryptoPrice(
                                        item.quantity * item.unit_price,
                                        item.currency_code
                                    )}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>

                    {/* Twitter and Quantity */}
                    <Flex flexDir={'column'} height="70px" width="100%">
                        {/*<Flex alignSelf="center">*/}
                        {/*    <Tweet*/}
                        {/*        productHandle={item.variant.product.handle}*/}
                        {/*        isPurchased={true}*/}
                        {/*    />*/}
                        {/*</Flex>*/}
                        <Text fontSize={{ base: '14px', md: '16px' }}>
                            Quantity: {item.quantity}
                        </Text>
                        <Text
                            maxW={{ base: '200px', md: '336px' }}
                            height="46px"
                            width="100%"
                            fontSize={{ base: '14px', md: '16px' }}
                        >
                            {item.order_id}
                        </Text>
                    </Flex>
                </Flex>
            ))}

            {/* Shipping Information */}
            <Flex direction="column" mt="2rem">
                <Text fontWeight={600}>Shipping</Text>
                {cart.shipping_methods.map((method) => (
                    <Flex
                        key={method.id}
                        justifyContent="space-between"
                        mt="0.5rem"
                    >
                        <Text>{method.shipping_option.name}</Text>
                        <Text>
                            {formatCryptoPrice(
                                method.price,
                                cart.items[0].currency_code
                            )}
                        </Text>
                    </Flex>
                ))}
            </Flex>

            {/* Total Summary */}
            <Flex direction="column" mt="2rem">
                <Divider borderColor="#555555" />
                <Flex justifyContent="space-between" mt="1rem">
                    <Text fontWeight={600}>Subtotal</Text>
                    <Text>
                        {formatCryptoPrice(
                            cart?.subtotal as number,
                            cart?.items[0]?.currency_code || 'usdc'
                        )}
                    </Text>
                </Flex>
                <Flex justifyContent="space-between" mt="0.5rem">
                    <Text fontWeight={600}>Shipping</Text>
                    <Text>
                        {formatCryptoPrice(
                            cart?.shipping_total as number,
                            cart?.items[0]?.currency_code || 'usdc'
                        )}
                    </Text>
                </Flex>
                <Divider borderColor="#555555" mt="1rem" />
                <Flex justifyContent="space-between" mt="1rem">
                    <Text fontWeight={600} fontSize="18px">
                        Total
                    </Text>
                    <Text fontSize="18px">
                        {formatCryptoPrice(
                            cart?.total as number,
                            cart?.items[0]?.currency_code || 'usdc'
                        )}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Summary;
