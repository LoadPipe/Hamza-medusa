import React, { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import EmptyState from '@modules/order/components/empty-state';
import { useQueryClient } from '@tanstack/react-query';
import { OrdersData } from './all';
import { useOrderTabStore } from '@/zustand/order-tab-state';
import ShippedOrder from './orders/shipped';

const Shipped = ({
    customer,
    isEmpty,
}: {
    customer: string;
    isEmpty?: boolean;
}) => {
    const queryClient = useQueryClient();
    const cachedData: OrdersData | undefined = queryClient.getQueryData([
        'batchOrders',
    ]);

    const shippedOrder = cachedData?.Shipped || [];

    if (isEmpty && shippedOrder?.length === 0) {
        return <EmptyState />;
    }

    return (
        <div>
            {/* Processing-specific content */}
            {shippedOrder && shippedOrder.length > 0 ? (
                <Flex width={'100%'} flexDirection="column">
                    {shippedOrder.map((order: any) => {
                        return <ShippedOrder order={order} />;
                    })}
                </Flex>
            ) : null}
        </div>
    );
};

export default Shipped;
