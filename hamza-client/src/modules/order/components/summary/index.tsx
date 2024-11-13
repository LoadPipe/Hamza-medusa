'use client';
import React, { useEffect, useState } from 'react';
import { Flex, Text, Divider } from '@chakra-ui/react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import Thumbnail from '@modules/products/components/thumbnail';
import Tweet from '@/components/tweet';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import Image from 'next/image';
import currencyIcons from '../../../../../public/images/currencies/crypto-currencies';
import { getOrderSummary } from '@lib/data/index';
import { Cart, Order } from '@medusajs/medusa';

type SummaryProps = {
    order: Order;
};

const Summary: React.FC<SummaryProps> = ({ order }) => {
    return (
        <Flex direction="column" width={'100%'}>
            <Text fontWeight={600}>Your Order</Text>
            {order.items.map((item, index) => (
                <Flex key={item.id} width={'100%'} flexDir={'column'}>
                    <Divider
                        mt="1rem"
                        mb="0.5rem"
                        display={index !== 0 ? 'flex' : 'none'}
                        borderColor={'#555555'}
                    />
                    <Flex mt="1rem" height={'70px'} width={'100%'}>
                        <Flex flexDir={'column'}>
                            <LocalizedClientLink
                                href={`/products/${item.variant.product.handle}`}
                            >
                                <Flex width={'55px'} height={'55px'}>
                                    <Thumbnail
                                        thumbnail={item.thumbnail}
                                        images={[]}
                                        size="small"
                                    />
                                </Flex>
                            </LocalizedClientLink>
                        </Flex>
                        <Text
                            ml="1rem"
                            maxW={{ base: '200px', md: '336px' }}
                            height={'46px'}
                            width={'100%'}
                            fontSize={{ base: '14px', md: '16px' }}
                            noOfLines={2}
                        >
                            {item.title}
                        </Text>

                        <Flex ml="auto">
                            <Flex
                                height={'22px'}
                                alignItems={'center'}
                                mb="auto"
                            >
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
                            <Flex
                                height={'22px'}
                                alignItems={'center'}
                                mb="auto"
                            >
                                <Text
                                    ml="0.4rem"
                                    alignSelf={'center'}
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
                    <Flex alignItems={'center'} height={'50px'} width={'100%'}>
                        <Flex alignSelf={'center'}>
                            <Tweet
                                productHandle={item.variant.product.handle}
                                isPurchased={true}
                            />
                        </Flex>
                        <Text ml="1rem" fontSize={{ base: '14px', md: '16px' }}>
                            Quantity: {item.quantity}
                        </Text>
                    </Flex>
                </Flex>
            ))}
        </Flex>
    );
};

export default Summary;
