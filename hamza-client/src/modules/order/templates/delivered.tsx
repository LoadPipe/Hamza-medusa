import { getSingleBucket } from '@lib/data';
import { Box, Divider, Text, Flex } from '@chakra-ui/react';
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
                <Flex width={'100%'} flexDirection="column">
                    <Text
                        fontSize={'16px'}
                        color={'primary.green.900'}
                        fontWeight="bold"
                        ml={'auto'}
                    >
                        Delivered
                    </Text>

                    {deliveredOrder.map((order: any) => (
                        <React.Fragment
                            key={order.id} // Changed from cart_id to id since it's more reliable and unique
                        >
                            {order.items?.map((item: any) => (
                                <Flex key={item.id}>
                                    <DeliveredCard
                                        key={item.id}
                                        order={item}
                                        storeName={order.store.name}
                                        icon={order.store.icon}
                                        handle={
                                            item.variant?.product?.handle ||
                                            'N/A'
                                        }
                                    />
                                </Flex>
                            ))}
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

export default Delivered;
