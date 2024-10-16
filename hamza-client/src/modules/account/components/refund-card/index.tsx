import { formatAmount } from '@lib/util/prices';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { Box, Flex, Text, Button, Image } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';
import React from 'react';

type OrderDetails = {
    thumbnail: string;
    title: string;
    description: string;
};

type Order = {
    id: string;
    display_id: string;
    created_at: string;
    details: OrderDetails;
    quantity: string;
    paid_total: number;
    currency_code: string;
    unit_price: number;
    thumbnail: string;
    title: string;
    description: string;
    variant: {
        product_id: string;
        metadata: {
            imgUrl?: string;
        };
    };
    region: {
        id: string;
        name: string;
    };
};

type OrderCardProps = {
    order: Order;
    handle: string;
    vendorName: string;
};

const RefundCard = ({ order, handle, vendorName }: OrderCardProps) => {
    const orderString = typeof order.currency_code;

    if (!order) {
        return <div>Loading...</div>; // Display loading message if order is undefined
    }

    return (
        <Flex
            my={4}
            color={'white'}
            justifyContent="space-between"
            width="100%"
            gap={4}
            flexDirection={{ base: 'row' }}
            flex="1"
        >
            <Flex
                justifyContent="space-between"
                flexDirection={{ base: 'column' }}
                flex="1"
            >
                <Flex mb={2} display={{ base: 'flex' }} alignItems="center">
                    <Text
                        fontSize={{ base: '18px', md: '24px' }}
                        fontWeight="bold"
                        noOfLines={1}
                        mr={2}
                    >
                        {vendorName}
                    </Text>
                    <FaCheckCircle color="#3196DF" />
                </Flex>

                {/* Left Side: Existing Content */}
                <Flex
                    direction={{ base: 'column', lg: 'row' }}
                    alignItems={{ base: 'flex-start', md: 'center' }}
                    justifyContent="space-between"
                    flex="1"
                >
                    <Link
                        href={`/${process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? 'en'}/products/${handle}`}
                    >
                        <Image
                            minWidth="80px"
                            borderRadius="lg"
                            width={{ base: '75px', md: '100px' }}
                            height={{ base: '75px', md: '100px' }}
                            src={
                                order?.variant?.metadata?.imgUrl ??
                                order.thumbnail ??
                                ''
                            }
                            alt={`Thumbnail of ${order.title}`}
                            mr={{ base: 2, md: 4 }}
                            mb={{ base: 4, md: 0 }}
                        />
                    </Link>

                    <Flex
                        justifyContent="space-between"
                        direction="column"
                        flex="1"
                    >
                        <Flex direction="column">
                            <Text fontWeight="bold" fontSize="18px">
                                {order.title}
                            </Text>
                            <Flex
                                direction={{ base: 'column', md: 'row' }}
                                alignItems={'center'}
                                color={'rgba(85, 85, 85, 1.0)'}
                            >
                                <Text
                                    fontSize={{ base: '14px' }}
                                    mr={1} // Add some space between "Variation:" and the description
                                >
                                    Variation:
                                </Text>
                                <Text fontSize="14px">{order.description}</Text>
                            </Flex>
                            <Flex direction={'row'} gap={2}>
                                <Text
                                    color={'rgba(85, 85, 85, 1.0)'}
                                    fontSize="16px"
                                >
                                    Order Date
                                </Text>
                                <Text color={'white'} fontSize="16px">
                                    {new Date(
                                        order.created_at
                                    ).toLocaleDateString()}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>

            {/* Right Side: Courier and Address */}
            <Flex direction="column">
                <Flex direction={{ base: 'column', md: 'column' }}>
                    <Text color={'rgba(85, 85, 85, 1.0)'} fontSize="16px">
                        Status{' '}
                    </Text>
                    <Text color={'white'} fontSize="16px">
                        Under review
                    </Text>
                </Flex>

                <Flex direction={{ base: 'column', md: 'column' }}>
                    <Text color={'rgba(85, 85, 85, 1.0)'} fontSize="16px">
                        Return Reason
                    </Text>
                    <Text color={'white'} fontSize="16px">
                        Received the wrong product
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default RefundCard;
