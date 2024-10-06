import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import React from 'react';
type OrderDetails = {
    thumbnail: string;
    title: string;
    description: string;
};
import Link from 'next/link';

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

const ProcessingOrderCard = ({
    order,
    handle,
    vendorName,
    address,
}: OrderCardProps) => {
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
        >
            <Flex alignItems="center" mb={4}>
                <Text
                    fontSize={{ base: '18px', md: '24px' }}
                    fontWeight="bold"
                    noOfLines={1}
                >
                    {vendorName}
                </Text>
                <Flex display={{ base: 'flex' }} ml={2} alignItems="center">
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
                                <Text
                                    fontSize={{ base: '16px', md: '18px' }}
                                    fontWeight="bold"
                                >
                                    {order.title}
                                </Text>
                                <Flex direction="column" mt={2}>
                                    <Text
                                        fontSize={{ base: '14px', md: '16px' }}
                                        color={'rgba(85, 85, 85, 1.0)'}
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
                    {/*<Box mb={4}>*/}
                    {/*    <Text color={'rgba(85, 85, 85, 1.0)'} fontSize="16px">*/}
                    {/*        Courier*/}
                    {/*    </Text>*/}
                    {/*    <Text color={'white'} fontSize="16px">*/}
                    {/*        DHL Express*/}
                    {/*    </Text>*/}
                    {/*</Box>*/}

                    <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
                        <Box>
                            <Text
                                color={'rgba(85, 85, 85, 1.0)'}
                                fontSize="16px"
                            >
                                Address
                            </Text>
                            <Text color={'white'} fontSize="16px">
                                {address?.address_1 || 'N/A'}{' '}
                                {address?.address_2 || ''}{' '}
                                {address?.city || 'N/A'}{' '}
                                {address?.province || 'N/A'}{' '}
                                {address?.postal_code || 'N/A'}
                            </Text>
                        </Box>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    );
};

export default ProcessingOrderCard;
