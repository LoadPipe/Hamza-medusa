import { Flex, Text, Link, Image } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
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
    showDate: boolean;
};

const OrderLeftColumn = ({
    vendorName,
    handle,
    order,
    showDate = false,
}: OrderCardProps) => {
    return (
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
                            <Text fontSize={{ base: '16px' }} mr={1}>
                                Variation:
                            </Text>
                            <Text fontSize="16px">{order.description}</Text>
                        </Flex>

                        {/* Conditionally render the date if showDate is true */}
                        {showDate && (
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
                        )}
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default OrderLeftColumn;
