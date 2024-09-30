import { getSingleBucket } from '@lib/data';
import { Box, Text } from '@chakra-ui/react';
import Spinner from '@modules/common/icons/spinner';

import DeliveredCard from '@modules/account/components/delivered-card';
import EmptyState from '@modules/order/components/empty-state';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const Delivered = ({
    customer,
    isEmpty,
}: {
    customer: string;
    isEmpty?: boolean;
}) => {
    const {
        data: customerOrder,
        isLoading,
        isError,
    } = useQuery(
        ['fetchAllOrders', customer],
        () => getSingleBucket(customer, 3),
        {
            enabled: !!customer, // Only fetch if `customer` is provided
        }
    );

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

    if (isEmpty && customerOrder && customerOrder?.length == 0) {
        return <EmptyState />;
    }

    return (
        <div>
            {/* Processing-specific content */}
            {customerOrder && customerOrder.length > 0 ? (
                <>
                    <h1>Delivered Orders</h1>

                    {customerOrder.map((order: any) => (
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
                                        <DeliveredCard
                                            key={item.id}
                                            order={item}
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

export default Delivered;
