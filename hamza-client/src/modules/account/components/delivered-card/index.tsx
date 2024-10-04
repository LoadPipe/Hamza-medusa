import { formatAmount } from '@lib/util/prices';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { Box, Flex, Text, Button, Image } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import { addToCart } from '@modules/cart/actions';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Spinner from '@modules/common/icons/spinner';
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

const DeliveredCard = ({ order, handle, vendorName }: OrderCardProps) => {
    const orderString = typeof order.currency_code;
    const router = useRouter();
    let countryCode = useParams().countryCode as string;
    if (process.env.NEXT_PUBLIC_FORCE_COUNTRY) countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY;

    const getAmount = (amount?: number | null) => {
        if (amount === null || amount === undefined) {
            return;
        }

        return formatCryptoPrice(amount, order.currency_code || 'USDC');
    };

    //TODO: Refactor to a mutation
    const handleReorder = async (order: any) => {
        try {
            await addToCart({
                variantId: order.variant_id,
                countryCode: countryCode,
                quantity: order.quantity,
            });
        } catch (e) {
            toast.error(`Product with name ${order.title} could not be added`);
        }

        router.push('/checkout');
    };

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
            <Flex alignItems="center" justifyContent="space-between">
                <Link href={`/us/products/${handle}`}>
                    <Image
                        borderRadius="lg"
                        width={{ base: '60px', md: '120px' }}
                        src={
                            order.thumbnail ??
                            ''
                        }
                        alt={`Thumbnail of ${order.title}`}
                        mr={4}
                    />
                </Link>

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
                {/*// TODO: Probably makes sense to have this here but yahh*/}
                {/*<Button*/}
                {/*    ml={2}*/}
                {/*    variant="outline"*/}
                {/*    colorScheme="white"*/}
                {/*    borderRadius={'37px'}*/}
                {/*>*/}
                {/*    Add A Review*/}
                {/*</Button>*/}
            </Flex>
        </Box>
    );
};

export default DeliveredCard;
