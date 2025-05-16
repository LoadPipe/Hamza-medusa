import { Flex } from '@chakra-ui/react';
import EmptyState from '@modules/order/components/empty-state';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { OrdersData } from './all';
import { useOrderTabStore } from '@/zustand/order-tab-state';
import CancelledOrder from './orders/cancelled';

const Cancelled = ({
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

    const canceledOrder = cachedData?.Cancelled || [];
    if (isEmpty && canceledOrder && canceledOrder?.length == 0) {
        return <EmptyState />;
    }

    return (
        <div style={{ width: '100%' }}>
            {canceledOrder && canceledOrder.length > 0 ? (
                <Flex width={'100%'} flexDirection="column">
                    {canceledOrder.map((order: any) => {
                        return <CancelledOrder key={order.id} order={order} />;
                    })}
                </Flex>
            ) : null}
        </div>
    );
};

export default Cancelled;
