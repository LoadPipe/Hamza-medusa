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
        <Box
            // bg={'#272727'}
            color={'white'}
            p={4}
            rounded="lg"
            shadow="base"
            maxWidth="1000px"
            m="auto"
            mt={2}
        >
            <Flex alignItems="center" mb={2}>
                <Text
                    fontSize={{ base: '22px', md: '24px' }}
                    fontWeight="bold"
                    noOfLines={1}
                >
                    {vendorName}
                </Text>
                <Flex
                    display={{ base: 'none', md: 'flex' }}
                    ml={2}
                    alignItems="center"
                >
                    <FaCheckCircle color="#3196DF" />
                </Flex>
            </Flex>

            <Flex
                justifyContent="space-between"
                flexDirection={{ base: 'column', md: 'row' }}
                gap={{ base: 4, md: 0 }}
            >
                {' '}
                {/* Left Side: Existing Content */}
                <Flex
                    direction={{ base: 'column', md: 'row' }}
                    alignItems={{ base: 'flex-start', md: 'center' }}
                    justifyContent="space-between"
                >
                    <Link
                        href={`/${process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? 'en'}/products/${handle}`}
                    >
                        <Image
                            borderRadius="lg"
                            width={{ base: '120px', md: '180px' }}
                            src={
                                order?.variant?.metadata?.imgUrl ??
                                order.thumbnail ??
                                ''
                            }
                            alt={`Thumbnail of ${order.title}`}
                            mr={{ base: 1, md: 4 }}
                            mb={{ base: 4, md: 0 }}
                        />
                    </Link>

                    <Box flex="1">
                        <Flex justifyContent="space-between" direction="row">
                            <Flex direction="column">
                                <Text
                                    color={'rgba(85, 85, 85, 1.0)'}
                                    fontSize="16px"
                                >
                                    Item Name
                                </Text>
                                <Text fontWeight="bold" fontSize="18px">
                                    {order.title}
                                </Text>
                                <Flex direction="row" alignItems="center">
                                    <Text
                                        color={'rgba(85, 85, 85, 1.0)'}
                                        fontSize="16px"
                                        mr={1} // Add some space between "Variation:" and the description
                                    >
                                        Variation:
                                    </Text>
                                    <Text fontSize="14px">
                                        {order.description}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Flex>

                        <Flex direction="column" mt={2}>
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
                    </Box>
                </Flex>
                {/* Right Side: Courier and Address */}
                <Flex direction="column" minWidth="200px" maxWidth="300px">
                    <Box mb={4}>
                        <Text color={'rgba(85, 85, 85, 1.0)'} fontSize="16px">
                            Status
                        </Text>
                        <Text color={'white'} fontSize="16px">
                            Under review
                        </Text>
                    </Box>

                    <Box>
                        <Text color={'rgba(85, 85, 85, 1.0)'} fontSize="16px">
                            Return Reason
                        </Text>
                        <Text color={'white'} fontSize="16px">
                            Received the wrong product
                        </Text>
                    </Box>
                </Flex>
            </Flex>
        </Box>
    );
};

export default RefundCard;
