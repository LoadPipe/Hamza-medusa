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
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
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
import { OrdersData } from './all';
import { useOrderTabStore } from '@/zustand/order-tab-state';
import OrderTimeline from '@modules/order/components/order-timeline';

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
    const orderActiveTab = useOrderTabStore((state) => state.orderActiveTab);

    // const debouncedOnSuccess = debounce(() => {
    //     onSuccess && onSuccess();
    // }, 1000);

    const queryClient = useQueryClient();

    const cachedData: OrdersData | undefined = queryClient.getQueryData([
        'batchOrders',
    ]);

    const refundOrder = cachedData?.Refunded || [];

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
            {refundOrder && refundOrder.length > 0 ? (
                <Flex width={'100%'} flexDirection="column">
                    {refundOrder.map((order: any) => {
                        const subTotal = order.items.reduce(
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
                                                    subTotal={subTotal}
                                                    currencyCode={
                                                        item.currency_code
                                                    }
                                                    index={index}
                                                    itemCount={
                                                        order.items.length - 1
                                                    }
                                                    paymentTotal={
                                                        order.payments[0]
                                                    }
                                                />
                                                <Flex
                                                    direction={{
                                                        base: 'column',
                                                        md: 'row',
                                                    }}
                                                    justifyContent={'flex-end'}
                                                    gap={2}
                                                    mt={{ base: 4, md: 0 }}
                                                    width="100%"
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
                                                <Box mt={4}>
                                                    <Tabs variant="unstyled">
                                                        <TabList>
                                                            <Tab
                                                                _selected={{
                                                                    color: 'primary.green.900',
                                                                    borderBottom:
                                                                        '2px solid',
                                                                    borderColor:
                                                                        'primary.green.900',
                                                                }}
                                                            >
                                                                Order Timeline
                                                            </Tab>
                                                            <Tab
                                                                _selected={{
                                                                    color: 'primary.green.900',
                                                                    borderBottom:
                                                                        '2px solid',
                                                                    borderColor:
                                                                        'primary.green.900',
                                                                }}
                                                            >
                                                                Order Details
                                                            </Tab>
                                                        </TabList>
                                                        <TabPanels>
                                                            <TabPanel>
                                                                <OrderTimeline
                                                                    orderDetails={
                                                                        order
                                                                    }
                                                                />
                                                            </TabPanel>

                                                            <TabPanel>
                                                                <VStack
                                                                    align="start"
                                                                    spacing={4}
                                                                    p={4}
                                                                    borderRadius="lg"
                                                                    w="100%"
                                                                >
                                                                    <VStack
                                                                        align="start"
                                                                        spacing={
                                                                            2
                                                                        }
                                                                    >
                                                                        {order
                                                                            ?.shipping_methods[0]
                                                                            ?.price && (
                                                                            <Text fontSize="md">
                                                                                <strong>
                                                                                    Order
                                                                                    Shipping
                                                                                    Cost:
                                                                                </strong>{' '}
                                                                                {formatCryptoPrice(
                                                                                    Number(
                                                                                        order
                                                                                            ?.shipping_methods[0]
                                                                                            ?.price
                                                                                    ),
                                                                                    item.currency_code ??
                                                                                        'usdc'
                                                                                )}{' '}
                                                                                {upperCase(
                                                                                    item.currency_code
                                                                                )}
                                                                            </Text>
                                                                        )}
                                                                        <Text>
                                                                            <strong>
                                                                                Subtotal:{' '}
                                                                            </strong>{' '}
                                                                            {formatCryptoPrice(
                                                                                subTotal,
                                                                                item.currency_code
                                                                            )}{' '}
                                                                            {upperCase(
                                                                                item.currency_code
                                                                            )}
                                                                        </Text>
                                                                        <Text>
                                                                            <strong>Tracking Number: </strong>
                                                                            {order?.tracking_number && typeof order.tracking_number === 'string' ? order.tracking_number : 'Tracking number not available'}
                                                                        </Text>
                                                                    </VStack>
                                                                </VStack>
                                                            </TabPanel>
                                                        </TabPanels>
                                                    </Tabs>
                                                </Box>
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
