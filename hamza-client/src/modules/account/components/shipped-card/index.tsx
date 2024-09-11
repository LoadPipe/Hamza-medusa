import { formatAmount } from '@lib/util/prices';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { Box, Flex, Text, Button, Image } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { getStore } from '@lib/data';
import Link from 'next/link';

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
    };
    region: {
        id: string;
        name: string;
    };
};

type OrderCardProps = {
    order: Order;
    handle: any;
};

const ShippedCard = ({ order, handle }: OrderCardProps) => {
    const [store, setStore] = useState('');
    const orderString = typeof order.currency_code;
    // console.log(
    //     `Order Card details ${JSON.stringify(order.variant.product_id)}`
    // );
    // console.log(`Product details ${JSON.stringify(handle)} `);

    const getAmount = (amount?: number | null) => {
        if (amount === null || amount === undefined) {
            return;
        }

        return formatCryptoPrice(amount, order.currency_code || 'USDC');
    };

    useEffect(() => {
        // Fetch Vendor Name from product.id
        const fetchVendor = async () => {
            try {
                const data = await getStore(order.variant.product_id as string);
                // console.log(`Vendor: ${data}`);
                setStore(data.name);
            } catch (error) {
                console.error('Error fetching store: ', error);
            }
        };

        fetchVendor();
    }, [order]);

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
                    fontSize={{ base: '14px', md: '24px' }}
                    fontWeight="bold"
                    noOfLines={1}
                >
                    {store}
                </Text>
                <Flex
                    display={{ base: 'none', md: 'flex' }}
                    ml={2}
                    alignItems="center"
                >
                    <FaCheckCircle color="#3196DF" />
                </Flex>
            </Flex>

            <Flex justifyContent="space-between">
                {/* Left Side: Existing Content */}
                <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    flex="1"
                >
                    <Link href={`/us/products/${handle}`}>
                        <Image
                            borderRadius="lg"
                            width={{ base: '60px', md: '120px' }}
                            src={order.thumbnail}
                            alt={`Thumbnail of ${order.title}`}
                            mr={4}
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
                                </Flex>{' '}
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
                <Flex
                    direction="column"
                    ml={4}
                    minWidth="200px"
                    maxWidth="300px"
                >
                    <Box mb={4}>
                        <Text color={'rgba(85, 85, 85, 1.0)'} fontSize="16px">
                            Courier
                        </Text>
                        <Text color={'white'} fontSize="16px">
                            DHL Express
                        </Text>
                    </Box>

                    <Box>
                        <Text color={'rgba(85, 85, 85, 1.0)'} fontSize="16px">
                            Address
                        </Text>
                        <Text color={'white'} fontSize="16px">
                            Rock Rocks Pa Daet Sub-district, 50100, Chiang Mai
                            CA
                        </Text>
                    </Box>
                </Flex>
            </Flex>
        </Box>
    );
};

export default ShippedCard;
