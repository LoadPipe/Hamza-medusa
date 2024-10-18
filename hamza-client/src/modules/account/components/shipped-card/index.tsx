import { formatCryptoPrice } from '@lib/util/get-product-price';
import { Box, Flex, Text, Button, Image } from '@chakra-ui/react';
import React from 'react';
import OrderLeftColumn from '@modules/order/templates/order-left-column';
import OrderRightAddress from '@modules/order/templates/order-right-address';

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
    icon: string;
    handle: string;
    storeName: string;
    address: any;
};

const ShippedCard = ({
    order,
    icon,
    handle,
    storeName,
    address,
}: OrderCardProps) => {
    const orderString = typeof order.currency_code;

    const getAmount = (amount?: number | null) => {
        if (amount === null || amount === undefined) {
            return;
        }

        return formatCryptoPrice(amount, order.currency_code || 'USDC');
    };

    if (!order) {
        return <div>Loading...</div>; // Display loading message if order is undefined
    }
    return (
        <Flex
            mb={4}
            color={'white'}
            justifyContent="space-between"
            maxWidth="100%"
            flexDirection={{ base: 'column', md: 'row' }}
        >
            {/* Left Side: Default  */}
            <OrderLeftColumn
                order={order}
                handle={handle}
                storeName={storeName}
                icon={icon}
                showDate={false}
            />

            {/* Right Side: Address */}
            <OrderRightAddress address={address} />
        </Flex>
    );
};

export default ShippedCard;
