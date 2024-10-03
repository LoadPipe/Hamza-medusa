import { getSingleBucket } from '@lib/data';
import { Box, Text } from '@chakra-ui/react';
import CancelCard from '@modules/account/components/cancel-card';
import EmptyState from '@modules/order/components/empty-state';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Spinner from '@modules/common/icons/spinner';
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';

const Cancelled = ({
    customer,
    chainEnabled,
    onSuccess,
    isEmpty,
}: {
    customer: string;
    chainEnabled?: boolean;
    onSuccess?: () => void;
    isEmpty?: boolean;
}) => {
    // Fetch canceled orders with useQuery
    const [shouldFetch, setShouldFetch] = useState(false);
    console.log(`chainEnabled Cancelled ${chainEnabled}`);

    const debouncedOnSuccess = debounce(() => {
        onSuccess && onSuccess();
    }, 1000);

    const queryClient = useQueryClient();

    const {
        data: canceledOrder,
        isLoading: cancelIsLoading,
        isError: cancelIsError,
        isFetching,
        failureCount,
        isStale,
        isSuccess,
        refetch,
    } = useQuery(
        ['fetchCanceledOrder', customer],
        () => getSingleBucket(customer, 4),
        {
            enabled: !!customer && chainEnabled, // Ensure query only runs when enabled is true
            retry: 5,
        }
    );

    // manually trigger a refetch if its stale
    useEffect(() => {
        if (isStale && chainEnabled && canceledOrder == undefined) {
            queryClient.resetQueries(['fetchCanceledOrder']);
        }
    }, [isStale]);

    useEffect(() => {
        if (isSuccess && canceledOrder) {
            console.log(`TRIGGER`);
            debouncedOnSuccess();
        }
    }, [isSuccess, chainEnabled]);

    // Log the queries for cancelled state and data
    console.log({
        template: 'CANCELLED',
        cancelIsLoading,
        cancelIsError,
        isFetching,
        failureCount,
        canceledOrder,
        isStale,
    });

    if (isEmpty && canceledOrder && canceledOrder?.length == 0) {
        return <EmptyState />;
    }

    if (cancelIsLoading) {
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
                    Loading Cancelled orders...
                </Text>
                <Spinner size={80} />
            </Box>
        );
    }

    if (cancelIsError || !canceledOrder) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                py={5}
            >
                <Text color="red.500" fontSize="lg">
                    Error fetching reviews.
                </Text>
            </Box>
        );
    }
    return (
        <div>
            {canceledOrder && canceledOrder.length > 0 ? (
                <>
                    <h1>Cancelled Orders</h1>

                    {canceledOrder.map((order: any) => (
                        <div
                            key={order.id} // Changed from cart_id to id since it's more reliable and unique
                            className="border-b border-gray-200 pb-6 last:pb-0 last:border-none"
                        >
                            {order.items?.map(
                                (
                                    item: any // Adjusting the map to the correct path
                                ) => (
                                    <Box
                                        key={item.id}
                                        bg="rgba(39, 39, 39, 0.3)"
                                        p={4}
                                        m={2}
                                        rounded="lg"
                                    >
                                        {/*item: {item.id} <br />*/}
                                        <CancelCard
                                            key={item.id}
                                            order={item}
                                            vendorName={order.store.name}
                                            cancel_reason={
                                                order.metadata?.cancel_reason ||
                                                'No cancellation details were provided.'
                                            }
                                            cancelled_date={
                                                order.canceled_at ||
                                                'Cancel date N/A'
                                            }
                                            handle={
                                                item.variant?.product?.handle ||
                                                'N/A'
                                            }
                                        />
                                    </Box>
                                )
                            )}
                        </div>
                    ))}
                </>
            ) : null}
        </div>
    );
};

export default Cancelled;
