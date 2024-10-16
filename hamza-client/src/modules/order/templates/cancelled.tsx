import { getSingleBucket } from '@lib/data';
import { Box, Divider, Text, Flex } from '@chakra-ui/react';
import CancelCard from '@modules/account/components/cancel-card';
import EmptyState from '@modules/order/components/empty-state';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Spinner from '@modules/common/icons/spinner';
import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';

const Cancelled = ({
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
    // Fetch canceled orders with useQuery
    const [shouldFetch, setShouldFetch] = useState(false);

    // const debouncedOnSuccess = debounce(() => {
    //     onSuccess && onSuccess();
    // }, 1000);

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
            enabled: !!customer,
            retry: true,
            refetchOnWindowFocus: true,
        }
    );

    // manually trigger a refetch if its stale
    useEffect(() => {
        const retryFetch = async () => {
            if (isStale && canceledOrder == undefined) {
                for (let i = 0; i < 5; i++) {
                    if (canceledOrder == undefined) {
                        queryClient.resetQueries(['fetchCanceledOrder']);
                        queryClient.invalidateQueries(['fetchCanceledOrder']);
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
    //     if (isSuccess && canceledOrder) {
    //         console.log(`TRIGGER`);
    //         debouncedOnSuccess();
    //     }
    // }, [isSuccess, chainEnabled]);

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
                    Error fetching cancelled orders.
                </Text>
            </Box>
        );
    }
    return (
        <div>
            {canceledOrder && canceledOrder.length > 0 ? (
                <Flex width={'100%'} flexDirection="column">
                    <Text
                        fontSize={'16px'}
                        color={'primary.green.900'}
                        fontWeight="bold"
                        ml={'auto'}
                    >
                        Cancelled
                    </Text>

                    {canceledOrder.map((order: any) => (
                        <React.Fragment
                            key={order.id} // Changed from cart_id to id since it's more reliable and unique
                        >
                            {order.items?.map(
                                (
                                    item: any // Adjusting the map to the correct path
                                ) => (
                                    <Flex width={'100%'} key={item.id}>
                                        {/*item: {item.id} <br />*/}
                                        <CancelCard
                                            key={item.id}
                                            order={item}
                                            storeName={order.store.name}
                                            icon={order.store.icon}
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
                                    </Flex>
                                )
                            )}
                            <Divider
                                width="90%" // Line takes up 80% of the screen width
                                borderBottom="0.2px solid"
                                borderColor="#D9D9D9"
                                pr={'1rem'}
                                _last={{
                                    // pb: 0,
                                    // borderBottom: 'none',
                                    mb: 8,
                                }}
                            />
                        </React.Fragment>
                    ))}
                </Flex>
            ) : null}
        </div>
    );
};

export default Cancelled;
