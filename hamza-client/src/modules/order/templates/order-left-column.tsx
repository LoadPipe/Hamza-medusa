import { Flex, Text, Link, Image } from '@chakra-ui/react';
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
    showDate: boolean;
};

const OrderLeftColumn = ({
    handle,
    order,
    showDate = false,
}: OrderCardProps) => {
    return (
        <Flex
            justifyContent={{ sm: 'center', md: 'space-between' }}
            flexDirection={{ base: 'column' }}
            width={'100%'}
            maxW={{ sm: '350px', md: '500px' }}
            gap={1}
            // border="1px solid red"
        >
            <Flex direction={{ base: 'column', lg: 'row' }}>
                <Link
                    href={`/${process.env.NEXT_PUBLIC_FORCE_COUNTRY ?? 'en'}/products/${handle}`}
                >
                    <Image
                        borderRadius="lg"
                        width={'75px'}
                        height={'75px'}
                        backgroundColor={'white'}
                        src={
                            order?.variant?.metadata?.imgUrl ??
                            order.thumbnail ??
                            ''
                        }
                        alt={`Thumbnail of ${order.title}`}
                        mr={{ base: 0, md: 4 }}
                        mb={{ base: 4, md: 0 }}
                        mx={{ base: 'auto', md: 0 }}
                    />
                </Link>

                <Flex
                    justifyContent={{ sm: 'flex-start', md: 'space-between' }}
                    direction={{ sm: 'column', md: 'row' }}
                    alignItems={{ sm: 'flex-start' }}
                    mr="2"
                    gap={{ sm: '2', md: '0' }}
                >
                    <Flex direction="column" ml={{ sm: '0px', md: '25px' }}>
                        <Text
                            // maxWidth="600px"
                            // minWidth="200px"
                            noOfLines={4}
                            fontSize={{ base: '16px', md: '18px' }}
                            fontWeight="bold"
                        >
                            {order.title}
                        </Text>
                        <Flex
                            direction={{ base: 'row', md: 'row' }}
                            color={'rgba(85, 85, 85, 1.0)'}
                        >
                            <Text fontSize={{ base: '16px' }} mr={1}>
                                Variation:
                            </Text>
                            <Text noOfLines={2} fontSize="16px">
                                {order.description}
                            </Text>
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
