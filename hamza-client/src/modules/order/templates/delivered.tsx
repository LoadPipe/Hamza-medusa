import { Flex } from '@chakra-ui/react';
import EmptyState from '@modules/order/components/empty-state';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'next/navigation';
import { OrdersData } from './all';
import { useOrderTabStore } from '@/zustand/order-tab-state';
import DeliveredOrder from './orders/delivered';

const Delivered = ({
    customer,
    isEmpty,
}: {
    customer: string;
    isEmpty?: boolean;
}) => {
    let countryCode = useParams().countryCode as string;
    if (process.env.NEXT_PUBLIC_FORCE_COUNTRY)
        countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY;

    const orderActiveTab = useOrderTabStore((state) => state.orderActiveTab);
    const queryClient = useQueryClient();
    const cachedData: OrdersData | undefined = queryClient.getQueryData([
        'batchOrders',
    ]);
    const deliveredOrder = cachedData?.Delivered || [];

    if (isEmpty && deliveredOrder && deliveredOrder?.length == 0) {
        return <EmptyState />;
    }

    return (
        <div style={{ width: '100%' }}>
            {deliveredOrder && deliveredOrder.length > 0 ? (
                <Flex width={'100%'} flexDirection="column">
                    {deliveredOrder.map((order: any) => {
                        return <DeliveredOrder order={order} />;
                    })}
                </Flex>
            ) : null}
        </div>
    );
};

export default Delivered;
