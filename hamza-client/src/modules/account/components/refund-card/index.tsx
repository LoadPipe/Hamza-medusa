import { formatAmount } from '@lib/util/prices';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { Box, Flex, Text, Button, Image } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';
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

const RefundCard = ({ order, handle, storeName, icon }: OrderCardProps) => {
    const orderString = typeof order.currency_code;

    if (!order) {
        return <div>Loading...</div>; // Display loading message if order is undefined
    }

    return (
        <Flex
            my={4}
            color={'white'}
            justifyContent="space-between"
            width="100%"
            gap={4}
            flexDirection={{ base: 'row' }}
            flex="1"
        >
            <OrderLeftColumn
                order={order}
                handle={handle}
                storeName={storeName}
                icon={icon}
                showDate={true}
            />

            {/* Right Side: Courier and Address */}
            <Flex direction="column">
                <Flex direction={{ base: 'column', md: 'column' }}>
                    <Text color={'rgba(85, 85, 85, 1.0)'} fontSize="16px">
                        Status{' '}
                    </Text>
                    <Text color={'white'} fontSize="16px">
                        Under review
                    </Text>
                </Flex>

                <Flex direction={{ base: 'column', md: 'column' }}>
                    <Text color={'rgba(85, 85, 85, 1.0)'} fontSize="16px">
                        Return Reason
                    </Text>
                    <Text color={'white'} fontSize="16px">
                        Received the wrong product
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default RefundCard;
