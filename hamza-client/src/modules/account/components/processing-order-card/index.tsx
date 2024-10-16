import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import React from 'react';

type OrderDetails = {
    thumbnail: string;
    title: string;
    description: string;
};
import Link from 'next/link';
import OrderLeftColumn from '@modules/order/templates/order-left-column';
import OrderRightAddress from '@modules/order/templates/order-right-address';

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
        <Flex
            my={4}
            color={'white'}
            justifyContent="space-between"
            maxWidth="100%"
            flexDirection={{ sm: 'column', md: 'row' }}
        >
            {/* Left Side: Default  */}

            <OrderLeftColumn
                order={order}
                handle={handle}
                vendorName={vendorName}
                showDate={false}
            />

            {/* Right Side: Address */}
            <OrderRightAddress address={address} />
        </Flex>
    );
};

export default ProcessingOrderCard;
