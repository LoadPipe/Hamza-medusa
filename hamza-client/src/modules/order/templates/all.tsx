import { Box, Button, Text } from '@chakra-ui/react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrderBuckets } from '@/lib/server';
import AllOrders from './all-orders';

type Order = {};
export type OrdersData = {
    All: Order[];
    Processing: Order[];
    Shipped: Order[];
    Delivered: Order[];
    Cancelled: Order[];
    Refunded: Order[];
};

export interface OrderNote {
    id: string;
    note: string;
    public: boolean;
    created_at: string;
    updated_at: string;
}

type TransactionType = 'refund' | 'release';

export type HistoryMeta = {
    transaction_id: string;
    type: TransactionType;
    date: string;
};

export interface OrderHistory {
    // Other properties you might have...
    metadata: {
        transaction?: HistoryMeta[];
        source?: string;
    };
}

const All = ({ customer }: { customer: string }) => {
    const { data, error, isLoading } = useQuery<OrdersData>({
        queryKey: ['batchOrders'],
        queryFn: () => getOrderBuckets(customer),
        staleTime: 5000, // Keep data fresh for 5 seconds
    });

    // Check if any tab contains data
    const ordersExist =
        data &&
        ((data.All && data.All.length > 0) ||
            (data.Processing && data.Processing.length > 0) ||
            (data.Shipped && data.Shipped.length > 0) ||
            (data.Delivered && data.Delivered.length > 0) ||
            (data.Cancelled && data.Cancelled.length > 0) ||
            (data.Refunded && data.Refunded.length > 0));

    return (
        <React.Fragment>
            {ordersExist ? (
                <React.Fragment>
                    <AllOrders customer={customer} />
                </React.Fragment>
            ) : (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    width="full"
                    bg="rgba(39, 39, 39, 0.3)"
                    color="white"
                    p={8}
                >
                    <Text fontSize="xl" fontWeight="bold">
                        Nothing to see here
                    </Text>
                    <Text>
                        You don't have any orders yet, let us change that :)
                    </Text>
                    <LocalizedClientLink href="/" passHref>
                        <Button m={8} colorScheme="whiteAlpha">
                            Continue shopping
                        </Button>
                    </LocalizedClientLink>
                </Box>
            )}
        </React.Fragment>
    );
};

export default All;
