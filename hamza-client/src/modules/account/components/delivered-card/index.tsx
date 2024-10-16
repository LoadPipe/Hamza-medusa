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

const DeliveredCard = ({ order, handle, vendorName }: OrderCardProps) => {
    const orderString = typeof order.currency_code;
    const router = useRouter();
    let countryCode = useParams().countryCode as string;
    if (process.env.NEXT_PUBLIC_FORCE_COUNTRY)
        countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY;

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
        <Flex
            my={4}
            color={'white'}
            justifyContent="space-between"
            maxWidth="100%"
            flex="1"
            flexDirection={{ sm: 'column', md: 'row' }}
        >
            <Flex
                flexDirection={{ base: 'column' }}
                gap={{ base: 4, md: 0 }}
                flex="1"
            >
                <Flex
                    flex="1"
                    mb={2}
                    display={{ base: 'flex' }}
                    alignItems="center"
                >
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

                    <Flex direction="column" mr="2">
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

            <Flex
                justifyContent="flex-end"
                direction={{ base: 'row', md: 'column' }}
                mx="auto"
                pl={2}
            >
                <Flex direction={'row'}></Flex>
                <Flex direction={'row'}>
                    <Text fontSize="16px" fontWeight="semibold">
                        {getAmount(order.unit_price)}{' '}
                        {order.currency_code.toUpperCase()}
                    </Text>
                </Flex>

                <Flex direction={'row'} gap={2}>
                    <Button
                        variant="outline"
                        colorScheme="white"
                        borderRadius={'37px'}
                        mt={2}
                        onClick={() => handleReorder(order || [])}
                    >
                        Buy Again
                    </Button>
                    <Button
                        variant="outline"
                        colorScheme="white"
                        borderRadius={'37px'}
                        mt={2}
                    >
                        Return/Refund
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default DeliveredCard;
