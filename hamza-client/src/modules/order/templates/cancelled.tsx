import { getSingleBucket } from '@lib/data';
import { Box, Text } from '@chakra-ui/react';
import CancelCard from '@modules/account/components/cancel-card';
import EmptyState from '@modules/order/components/empty-state';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@modules/common/icons/spinner';
import React from 'react';

const Cancelled = ({
    customer,
    isEmpty,
}: {
    customer: string;
    isEmpty?: boolean;
}) => {
    // Fetch canceled orders with useQuery
    const {
        data: customerOrder,
        isLoading,
        isError,
    } = useQuery(
        ['fetchCancelledOrders', customer],
        () => getSingleBucket(customer, 4), // Fetch for status 4 (cancelled orders)
        {
            enabled: !!customer, // Only fetch if customer exists
        }
    );

    if (isEmpty && customerOrder && customerOrder?.length == 0) {
        return <EmptyState />;
    }

    return (
        <div>
            {isLoading && (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    textAlign="center"
                    py={5}
                >
                    <Text color="white" fontSize="lg" mb={8}>
                        Loading cancelled orders...
                    </Text>
                    <Spinner size={80} />
                </Box>
            )}

            {isError && (
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
            )}
            {/* Processing-specific content */}
            {customerOrder && customerOrder.length > 0 ? (
                <>
                    <h1>Cancelled Orders</h1>

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
                                        <CancelCard
                                            key={item.id}
                                            order={item}
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
