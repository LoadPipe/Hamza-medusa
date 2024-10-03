import { getSingleBucket } from '@lib/data';
import { Box, Text } from '@chakra-ui/react';
import Spinner from '@modules/common/icons/spinner';

import DeliveredCard from '@modules/account/components/delivered-card';
import EmptyState from '@modules/order/components/empty-state';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';

const Delivered = ({
    customer,
    // chainEnabled,
    // onSuccess,
    isEmpty,
}: {
    customer: string;
    // chainEnabled?: boolean;
    // onSuccess?: () => void;
    isEmpty?: boolean;
}) => {
    const [shouldFetch, setShouldFetch] = useState(false);

    // const debouncedOnSuccess = debounce(() => {
    //     onSuccess && onSuccess();
    // }, 1000);

    const queryClient = useQueryClient();

    const {
        data: deliveredOrder,
        isLoading,
        isError,
        isFetching,
        failureCount,
        isStale,
        isSuccess,
        refetch,
    } = useQuery(
        ['fetchDeliveredOrder', customer],
        () => getSingleBucket(customer, 3),
        {
            enabled: !!customer,
            retry: true,
            refetchOnWindowFocus: true,
        }
    );

    // manually trigger a refetch if its stale
    useEffect(() => {
        const retryFetch = async () => {
            if (isStale && deliveredOrder == undefined) {
                for (let i = 0; i < 3; i++) {
                    if (deliveredOrder == undefined) {
                        queryClient.resetQueries(['fetchDeliveredOrder']);
                        queryClient.invalidateQueries(['fetchDeliveredOrder']);
                        await new Promise((resolve) =>
                            setTimeout(resolve, 100)
                        );
                    }
                }
            }
        };
        retryFetch();
    }, [isStale]);

    // useEffect(() => {
    //     if (isSuccess && deliveredOrder) {
    //         console.log(`TRIGGER`);
    //         debouncedOnSuccess();
    //     }
    // }, [isSuccess, chainEnabled]);

    // Log the queries for delivered state and data
    console.log({
        template: 'DELIVERED',
        isLoading,
        isError,
        isFetching,
        failureCount,
        deliveredOrder,
        isStale,
    });

    const getAmount = (
        amount?: number | null,
        currency_code?: string | null
    ) => {
        if (amount === null || amount === undefined) {
            return;
        }

        return formatCryptoPrice(amount, currency_code || 'USDC');
    };

    if (isLoading) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                py={5}
            >
                <Text color="white" fontSize="lg" mb={8}>
                    Loading Delivered orders...
                </Text>
                <Spinner size={80} />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                py={5}
            >
                <Text color="red.500" fontSize="lg" mb={8}>
                    Error fetching delivered orders.
                </Text>
            </Box>
        );
    }

    if (isEmpty && deliveredOrder && deliveredOrder?.length == 0) {
        return <EmptyState />;
    }

    return (
        <div>
            {deliveredOrder && deliveredOrder.length > 0 ? (
                <>
                    <h1>Delivered Orders</h1>

                    {deliveredOrder.map((order: any) => (
                        <div
                            key={order.id} // Changed from cart_id to id since it's more reliable and unique
                            className="border-b border-gray-200 pb-6 last:pb-0 last:border-none"
                        >
                            {order.items?.map((item: any) => (
                                <Box
                                    key={item.id}
                                    bg="rgba(39, 39, 39, 0.3)"
                                    p={4}
                                    m={2}
                                    rounded="lg"
                                >
                                    <DeliveredCard
                                        key={item.id}
                                        order={item}
                                        vendorName={order.store.name}
                                        handle={
                                            item.variant?.product?.handle ||
                                            'N/A'
                                        }
                                    />
                                </Box>
                            ))}
                        </div>
                    ))}
                </>
            ) : null}
        </div>
    );
};

export default Delivered;
