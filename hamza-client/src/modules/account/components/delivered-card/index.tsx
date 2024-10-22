import { formatCryptoPrice } from '@lib/util/get-product-price';
import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import OrderLeftColumn from '@modules/order/templates/order-left-column';
import currencyIcons from '@/images/currencies/crypto-currencies';
import Image from 'next/image';

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
            <OrderLeftColumn
                order={order}
                handle={handle}
                storeName={storeName}
                icon={icon}
                showDate={false}
            />

            <Flex
                justifyContent={'center'}
                direction={{ base: 'column', md: 'column' }}
                gap={2}
            >
                <Flex direction={'row'}></Flex>
                <Flex direction={'row'} mr={'2rem'} gap={2}>
                    <Text fontSize="16px" fontWeight="semibold">
                        {getAmount(order.unit_price)}{' '}
                    </Text>
                    <Image
                        src={currencyIcons[order.currency_code ?? 'usdc']}
                        alt={order.currency_code?.toUpperCase() ?? 'USDC'}
                    />
                </Flex>
            </Flex>
        </Flex>
    );
};

export default DeliveredCard;
