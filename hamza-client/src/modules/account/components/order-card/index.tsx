import { formatAmount } from '@lib/util/prices';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import {
    Box,
    Flex,
    Text,
    Button,
    Image,
    Link,
    useColorModeValue,
} from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { getStoreName } from '@lib/data';
// Update the type definitions to reflect the structure of the received order
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
    region: {
        id: string;
        name: string;
    };
};

type OrderCardProps = {
    order: Order;
    handle: any;
};

const OrderCard = ({ order, handle }: OrderCardProps) => {
    if (!order) {
        return <div>Loading...</div>; // Display loading message if order is undefined
    }
    const [vendor, setVendor] = useState('');
    const textColor = useColorModeValue('gray.800', 'white');
    const orderString = typeof order.currency_code;
    console.log(
        `Order Card details ${JSON.stringify(order.variant.product_id)}`
    );
    console.log(`Product details ${JSON.stringify(handle)} `);

    useEffect(() => {
        // Fetch Vendor Name from product.id
        const fetchVendor = async () => {
            try {
                const data = await getStoreName(
                    order.variant.product_id as string
                );
                // console.log(`Vendor: ${data}`);
                setVendor(data);
            } catch (error) {
                console.error('Error fetching vendor: ', error);
            }
        };

        fetchVendor();
    }, [order]);
    return (
        <Box
            bg={'black'}
            color={'white'}
            p={4}
            rounded="lg"
            shadow="base"
            maxWidth="1000px"
            m="auto"
        >
            <Flex alignItems="center" justifyContent="space-between">
                <Image
                    borderRadius="lg"
                    width={{ base: '60px', md: '120px' }}
                    src={order.thumbnail}
                    alt={`Thumbnail of ${order.title}`}
                    mr={4}
                />

                <Box flex="1">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Flex alignItems="center">
                            <Text
                                fontSize={{ base: '14px', md: '24px' }}
                                fontWeight="bold"
                                noOfLines={1}
                            >
                                {vendor}
                            </Text>
                            <Flex
                                display={{ base: 'none', md: 'flex' }}
                                ml={2}
                                alignItems="center"
                            >
                                <FaCheckCircle color="#3196DF" />
                            </Flex>
                        </Flex>
                        <Text fontSize="md" fontWeight="semibold">
                            {order.unit_price} {order.currency_code}
                        </Text>
                    </Flex>

                    <Flex direction="column" mt={2}>
                        <Text fontWeight="bold" fontSize="lg">
                            {order.title}
                        </Text>
                        <Text fontSize="sm">{order.description}</Text>
                    </Flex>

                    <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        mt={2}
                    >
                        <Text fontSize="sm">
                            {new Date(order.created_at).toLocaleDateString()}
                        </Text>
                        <Text fontSize="sm">{order.quantity} item(s)</Text>
                    </Flex>
                </Box>
            </Flex>

            <Flex justifyContent="flex-end" mt={2}>
                <Button colorScheme="blue" mr={2}>
                    Buy Again
                </Button>
                <Button colorScheme="blue" mr={2}>
                    Contact Seller
                </Button>
            </Flex>
        </Box>
    );
};

export default OrderCard;
