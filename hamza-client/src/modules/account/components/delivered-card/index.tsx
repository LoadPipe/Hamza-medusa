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
import OrderLeftColumn from '@modules/order/templates/order-left-column';

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
    storeName: string;
    icon: string;
};

const DeliveredCard = ({ order, handle, storeName, icon }: OrderCardProps) => {
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
            <OrderLeftColumn
                order={order}
                handle={handle}
                storeName={storeName}
                icon={icon}
                showDate={false}
            />

            <Flex
                justifyContent="flex-end"
                direction={{ base: 'row', md: 'column' }}
                ml={'auto'}
            >
                <Flex direction={'row'}></Flex>
                <Flex direction={'row'}>
                    <Text fontSize="16px" fontWeight="semibold">
                        {getAmount(order.unit_price)}{' '}
                        {order.currency_code.toUpperCase()}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default DeliveredCard;
