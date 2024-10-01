import React, { useEffect, useState } from 'react';
import { getSingleBucket } from '@lib/data';
import { Box, Collapse, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { BsCircleFill } from 'react-icons/bs';
import RefundCard from '@modules/account/components/refund-card';
import EmptyState from '@modules/order/components/empty-state';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import Spinner from '@modules/common/icons/spinner';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';

const Refund = ({
    customer,
    enabled,
    onSuccess,
    isEmpty,
}: {
    customer: string;
    enabled?: boolean;
    onSuccess?: () => void;
    isEmpty?: boolean;
}) => {
    const [courierInfo, setCourierInfo] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);

    const debounceSetShouldFetch = debounce(() => setShouldFetch(true), 4000);

    useEffect(() => {
        if (customer) {
            debounceSetShouldFetch();
        }
    }, [customer]);

    const {
        data: refundOrder,
        isLoading,
        isError,
        isFetching,
        failureCount,
        isStale,
        isSuccess,
    } = useQuery(
        ['fetchRefundOrder', customer],
        () => getSingleBucket(customer, 5),
        {
            enabled: shouldFetch && !!customer && enabled,
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 5, // Retry 5 times
            retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 20000), // Exponential backoff with max delay of 20 seconds
            refetchOnWindowFocus: false,
        }
    );

    useEffect(() => {
        if (isSuccess) {
            onSuccess && onSuccess();
        }
    }, [isSuccess]);

    // Log the queries for refunded state and data
    console.log({
        template: 'REFUNDED',
        isLoading,
        isError,
        isFetching,
        failureCount,
        refundOrder,
        isStale,
    });

    const toggleRefundInfo = (orderId: any) => {
        setCourierInfo(courierInfo === orderId ? null : orderId);
    };

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
                    Loading Refunded orders...
                </Text>
                <Spinner size={80} />
            </Box>
        );
    }

    if (isError || !refundOrder) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                py={5}
            >
                <Text color="red" fontSize="lg" mb={8}>
                    Error loading refund orders
                </Text>
            </Box>
        );
    }

    if (isEmpty && refundOrder && refundOrder?.length == 0) {
        return <EmptyState />;
    }

    return (
        <div>
            {/* Processing-specific content */}
            {refundOrder && refundOrder.length > 0 ? (
                <>
                    <h1>Refund Orders</h1>

                    {refundOrder.map((order: any) => (
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
                                    {/*item: {item.id} <br />*/}
                                    <RefundCard
                                        key={item.id}
                                        order={item}
                                        vendorName={order.store.name}
                                        handle={
                                            item.variant?.product?.handle ||
                                            'N/A'
                                        }
                                    />
                                    <div className="flex justify-end pr-4">
                                        <Box
                                            color={'primary.green.900'}
                                            cursor="pointer"
                                            _hover={{
                                                textDecoration: 'underline',
                                            }}
                                            onClick={() =>
                                                toggleRefundInfo(item.id)
                                            }
                                        >
                                            Refund Details
                                        </Box>
                                    </div>
                                    <Collapse
                                        in={courierInfo === item.id}
                                        animateOpacity
                                    >
                                        <Box mt={4}>
                                            <Text
                                                fontSize="24px"
                                                fontWeight="semibold"
                                            >
                                                {getAmount(
                                                    order.unit_price,
                                                    order.currency_code
                                                )}{' '}
                                                {order.currency_code}
                                            </Text>
                                            <HStack
                                                align="start"
                                                spacing={3}
                                                w="100%"
                                            >
                                                {' '}
                                                <Icon
                                                    as={BsCircleFill}
                                                    color="primary.green.900"
                                                    boxSize={3}
                                                    mt={1}
                                                />
                                                {/* Right Column: Text */}
                                                <VStack
                                                    align="start"
                                                    spacing={2}
                                                >
                                                    {' '}
                                                    {/* Stack text vertically */}
                                                    <Text fontWeight="bold">
                                                        Your request is now
                                                        under review
                                                    </Text>
                                                    <Text
                                                        fontSize="sm"
                                                        color="gray.500"
                                                    >
                                                        Your request for a
                                                        refund is now under
                                                        review. We will update
                                                        you on the status of
                                                        your request within 3-5
                                                        business days. Thank you
                                                        for your patience.
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                        </Box>
                                    </Collapse>
                                </Box>
                            ))}
                        </div>
                    ))}
                </>
            ) : null}
        </div>
    );
};

export default Refund;
