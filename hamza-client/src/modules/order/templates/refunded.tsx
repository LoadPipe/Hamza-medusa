import React from 'react';
import { Flex } from '@chakra-ui/react';
import EmptyState from '@modules/order/components/empty-state';
import { useQueryClient } from '@tanstack/react-query';
import { OrdersData } from './all';
import { useOrderTabStore } from '@/zustand/order-tab-state';
import RefundedOrder from './orders/refunded-order';

const Refund = ({
    customer,
    isEmpty,
}: {
    customer: string;
    isEmpty?: boolean;
}) => {
    const orderActiveTab = useOrderTabStore((state) => state.orderActiveTab);

    const queryClient = useQueryClient();

    const cachedData: OrdersData | undefined = queryClient.getQueryData([
        'batchOrders',
    ]);

    const refundOrder = cachedData?.Refunded || [];

    if (isEmpty && refundOrder && refundOrder?.length == 0) {
        return <EmptyState />;
    }

    return (
        <div style={{ width: '100%' }}>
            {refundOrder && refundOrder.length > 0 ? (
                <Flex width={'100%'} flexDirection="column">
                    {refundOrder.map((order: any) => {
                        return <RefundedOrder key={order.id} order={order} />;
                    })}
                </Flex>
            ) : null}
        </div>
    );
};

export default Refund;
