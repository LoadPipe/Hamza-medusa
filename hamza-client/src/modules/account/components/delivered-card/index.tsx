import { formatAmount } from '@lib/util/prices';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { Box, Flex, Text, Button, Image } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { getStoreName } from '@lib/data';
import { addToCart } from '@modules/cart/actions';
import { useParams, useRouter } from 'next/navigation';

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

const DeliveredCard = ({ order, handle }: OrderCardProps) => {
    const [vendor, setVendor] = useState('');
    const orderString = typeof order.currency_code;
    const router = useRouter();
    let countryCode = useParams().countryCode as string;
    if (process.env.NEXT_PUBLIC_FORCE_US_COUNTRY) countryCode = 'us';

    console.log(
        `Order Card details ${JSON.stringify(order.variant.product_id)}`
    );
    console.log(`Product details ${JSON.stringify(handle)} `);

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

    const handleReorder = async (order: any) => {
        try {
            await addToCart({
                variantId: order.variant_id,
                countryCode: countryCode,
                currencyCode: order.currency_code,
                quantity: order.quantity,
            });
        } catch (e) {
            alert(`Product with name ${order.title} could not be added`);
        }

        router.push('/checkout');
    };

    if (!order) {
        return <div>Loading...</div>; // Display loading message if order is undefined
    }
    console.log(`What are order ITEMS? ${JSON.stringify(order)}`);
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

            <Flex alignItems="center" justifyContent="space-between">
                <Image
                    borderRadius="lg"
                    width={{ base: '60px', md: '120px' }}
                    src={order.thumbnail}
                    alt={`Thumbnail of ${order.title}`}
                    mr={4}
                />

                <Box flex="1">
                    <Flex justifyContent="space-between">
                        <Flex direction="column">
                            <Text fontWeight="bold" fontSize="18px">
                                {order.title}
                            </Text>
                            <Text fontSize="14px">{order.description}</Text>
                        </Flex>
                        <Text fontSize="24px" fontWeight="semibold">
                            {getAmount(order.unit_price)}{' '}
                            {order.currency_code.toUpperCase()}
                        </Text>
                    </Flex>

                    <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        mt={2}
                    >
                        <Text color={'rgba(85, 85, 85, 1.0)'} fontSize="16px">
                            {new Date(order.created_at).toLocaleDateString()}
                        </Text>
                        <Text fontSize="sm">{order.quantity} item(s)</Text>
                    </Flex>
                </Box>
            </Flex>

            <Flex justifyContent="flex-end" mt={2} gap={'4'}>
                <Button
                    variant="outline"
                    colorScheme="white"
                    borderRadius={'37px'}
                    onClick={() => {
                        handleReorder(order || []);
                    }}
                >
                    Buy Again
                </Button>
                <Button
                    variant="outline"
                    colorScheme="white"
                    borderRadius={'37px'}
                >
                    Return/Refund
                </Button>
                <Button
                    ml={2}
                    variant="outline"
                    colorScheme="white"
                    borderRadius={'37px'}
                >
                    Add A Review
                </Button>
            </Flex>
        </Box>
    );
};

export default DeliveredCard;
