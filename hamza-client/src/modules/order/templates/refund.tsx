import React, { useEffect, useState } from 'react';
import { getSingleBucket } from '@lib/data';
import {
    Flex,
    Box,
    Collapse,
    HStack,
    Icon,
    Text,
    VStack,
    Button,
} from '@chakra-ui/react';
import { BsCircleFill } from 'react-icons/bs';
import RefundCard from '@modules/account/components/refund-card';
import EmptyState from '@modules/order/components/empty-state';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import Spinner from '@modules/common/icons/spinner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { debounce, upperCase } from 'lodash';
import DynamicOrderStatus from '@modules/order/templates/dynamic-order-status';
import OrderTotalAmount from '@modules/order/templates/order-total-amount';

const Refund = ({
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
    const [courierInfo, setCourierInfo] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);

    // const debouncedOnSuccess = debounce(() => {
    //     onSuccess && onSuccess();
    // }, 1000);

    const queryClient = useQueryClient();

    const { data, isLoading, isError, refetch, isStale } = useQuery([
        'batchOrders',
    ]);

    const refundOrder = data?.Refunded || [];

    // manually trigger a refetch if its stale
    // useEffect(() => {
    //     const retryFetch = async () => {
    //         if (isStale && refundOrder == undefined) {
    //             for (let i = 0; i < 3; i++) {
    //                 if (refundOrder == undefined) {
    //                     queryClient.resetQueries(['fetchRefundOrder']);
    //                     queryClient.invalidateQueries(['fetchRefundOrder']);
    //                     await new Promise((resolve) =>
    //                         setTimeout(resolve, 100)
    //                     );
    //                 }
    //             }
    //         }
    //     };
    //     retryFetch();
    // }, [isStale]);

    // useEffect(() => {
    //     if (isSuccess && refundOrder) {
    //         console.log(`TRIGGER`);
    //         debouncedOnSuccess();
    //     }
    // }, [isSuccess, chainEnabled]);

    // Log the queries for refunded state and data
    // console.log({
    //     template: 'REFUNDED',
    //     isLoading,
    //     isError,
    //     isFetching,
    //     failureCount,
    //     refundOrder,
    //     isStale,
    // });

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

    if (isEmpty && refundOrder && refundOrder?.length == 0) {
        return <EmptyState />;
    }

    return (
        <div style={{ width: '100%' }}>
            {isLoading ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    textAlign="center"
                >
                    <Text color="white" fontSize="lg" mb={8}>
                        Loading Refunded orders...
                    </Text>
                    <Spinner size={80} />
                </Box>
            ) : isError ? (
                <Text>Error fetching refunded orders</Text>
            ) : refundOrder && refundOrder.length > 0 ? (
                <Flex width={'100%'} flexDirection="column">
                    {refundOrder.map((order: any) => {
                        const totalPrice = order.items.reduce(
                            (acc: number, item: any) =>
                                acc + item.unit_price * item.quantity,
                            0
                        );
                        return (
                            <Flex
                                key={order.id}
                                direction="column"
                                width="100%"
                            >
                                {order.items?.map(
                                    (item: any, index: number) => (
                                        <div key={item.id}>
                                            {index === 0 ? (
                                                <DynamicOrderStatus
                                                    paymentStatus={
                                                        order.payment_status
                                                    }
                                                    paymentType={'Refund'}
                                                />
                                            ) : null}
                                            {/*item: {item.id} <br />*/}
                                            <RefundCard
                                                key={item.id}
                                                order={item}
                                                storeName={order.store.name}
                                                icon={order.store.icon}
                                                handle={
                                                    item.variant?.product
                                                        ?.handle || 'N/A'
                                                }
                                            />

                                            <Flex
                                                direction={{
                                                    base: 'column',
                                                    md: 'row',
                                                }}
                                                justifyContent={{
                                                    base: 'flex-start',
                                                    md: 'space-between',
                                                }}
                                                alignItems={{
                                                    base: 'flex-start',
                                                    md: 'center',
                                                }}
                                                mb={5}
                                            >
                                                <OrderTotalAmount
                                                    totalPrice={totalPrice}
                                                    currencyCode={
                                                        item.currency_code
                                                    }
                                                    index={index}
                                                    itemCount={
                                                        order.items.length - 1
                                                    }
                                                />
                                                <Flex
                                                    flexDirection="row"
                                                    gap={2}
                                                    ml={{ base: 0, md: 'auto' }}
                                                    mt={{ base: 4, md: 0 }}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        colorScheme="white"
                                                        borderRadius="37px"
                                                        cursor="pointer"
                                                        _hover={{
                                                            textDecoration:
                                                                'underline',
                                                        }}
                                                        onClick={() =>
                                                            toggleRefundInfo(
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        Refund Details
                                                    </Button>
                                                </Flex>
                                            </Flex>
                                            <Collapse
                                                in={courierInfo === item.id}
                                                animateOpacity
                                            >
                                                <Flex mt={4} width="100%">
                                                    <Text
                                                        fontSize="24px"
                                                        fontWeight="semibold"
                                                    >
                                                        {getAmount(
                                                            item?.unit_price,
                                                            item?.currency_code
                                                        )}{' '}
                                                        {upperCase(
                                                            item?.currency_code
                                                        )}
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
                                                                Your request is
                                                                now under review
                                                            </Text>
                                                            <Text
                                                                fontSize="sm"
                                                                color="gray.500"
                                                            >
                                                                Your request for
                                                                a refund is now
                                                                under review. We
                                                                will update you
                                                                on the status of
                                                                your request
                                                                within 3-5
                                                                business days.
                                                                Thank you for
                                                                your patience.
                                                            </Text>
                                                        </VStack>
                                                    </HStack>
                                                </Flex>
                                            </Collapse>
                                        </div>
                                    )
                                )}
                            </Flex>
                        );
                    })}
                </Flex>
            ) : null}
        </div>
    );
};

export default Refund;
