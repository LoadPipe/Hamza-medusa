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
    address: any;
};

const ShippedCard = ({
    order,
    handle,
    vendorName,
    address,
}: OrderCardProps) => {
    const orderString = typeof order.currency_code;

    const getAmount = (amount?: number | null) => {
        if (amount === null || amount === undefined) {
            return;
        }

        return formatCryptoPrice(amount, order.currency_code || 'USDC');
    };

    if (!order) {
        return <div>Loading...</div>; // Display loading message if order is undefined
    }
    return (
        <Flex
            my={4}
            color={'white'}
            justifyContent="space-between"
            maxWidth="100%"
            flexDirection={{ sm: 'column', md: 'row' }}
        >
            <Flex
                justifyContent="space-between"
                flexDirection={{ base: 'column' }}
                gap={{ base: 4, md: 0 }}
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

                    <Flex justifyContent="space-between" direction="row" mr="2">
                        <Flex direction="column">
                            <Text
                                maxWidth="600px"
                                minWidth="200px"
                                noOfLines={4}
                                fontSize={{ base: '16px', md: '18px' }}
                                fontWeight="bold"
                            >
                                {order.title}
                            </Text>
                            <Flex
                                direction={{ base: 'column', md: 'row' }}
                                color={'rgba(85, 85, 85, 1.0)'}
                                alignItems={'center'}
                            >
                                <Text
                                    fontSize={{ base: '16px' }}
                                    mr={1} // Add some space between "Variation:" and the description
                                >
                                    Variation:
                                </Text>
                                <Text fontSize="16px">{order.description}</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <Flex direction={{ base: 'row', md: 'row' }} ml="auto" pl={2}>
                <Box>
                    <Text color={'rgba(85, 85, 85, 1.0)'} fontSize="16px">
                        Address
                    </Text>
                    <Text
                        minWidth="200px"
                        maxWidth="300px"
                        noOfLines={3}
                        color={'white'}
                        fontSize="16px"
                    >
                        {address?.address_1 || 'N/A'} {address?.address_2 || ''}{' '}
                        {address?.city || 'N/A'} {address?.province || 'N/A'}{' '}
                        {address?.postal_code || 'N/A'}
                    </Text>
                </Box>
            </Flex>
        </Flex>
    );
};

export default ShippedCard;
