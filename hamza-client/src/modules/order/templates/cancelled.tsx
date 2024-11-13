import { Box, Divider, Text, Flex, Button } from '@chakra-ui/react';
import CancelCard from '@modules/account/components/cancel-card';
import EmptyState from '@modules/order/components/empty-state';
import { useQuery } from '@tanstack/react-query';
import Spinner from '@modules/common/icons/spinner';
import React, { useState } from 'react';
import DynamicOrderStatus from '@modules/order/templates/dynamic-order-status';
import OrderTotalAmount from '@modules/order/templates/order-total-amount';
import CancellationModal from '@modules/order/templates/cancelled-modal';
import { OrdersData } from './all';
import { useOrderTabStore } from '@store/order-tab-state';

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
    const [activeOrder, setActiveOrder] = useState<string | null>(null); // State to track the active order's modal
    const orderActiveTab = useOrderTabStore((state) => state.orderActiveTab);

    const {
        data,
        isLoading: cancelIsLoading,
        isError: cancelIsError,
    } = useQuery<OrdersData>(['batchOrders']);

    const canceledOrder = data?.Cancelled || [];
    if (isEmpty && canceledOrder && canceledOrder?.length == 0) {
        return <EmptyState />;
    }

    return (
        <div style={{ width: '100%' }}>
            {cancelIsLoading ? (
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
            ) : cancelIsError && orderActiveTab !== 'All Orders' ? (
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
            ) : canceledOrder && canceledOrder.length > 0 ? (
                <Flex width={'100%'} flexDirection="column">
                    {canceledOrder.map((order: any) => {
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
                                                    paymentType={'Cancelled'}
                                                />
                                            ) : null}
                                            <CancelCard
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
                                                    direction={'row'}
                                                    justifyContent={'flex-end'}
                                                >
                                                    <Text
                                                        fontSize="16px"
                                                        fontWeight="semibold"
                                                    >
                                                        {/*{getAmount(*/}
                                                        {/*    order.unit_price*/}
                                                        {/*)}{' '}*/}
                                                        {/*{upperCase(*/}
                                                        {/*    order.currency_code*/}
                                                        {/*)}*/}
                                                    </Text>
                                                </Flex>
                                                {index ===
                                                order.items.length - 1 ? (
                                                    <Flex
                                                        direction={{
                                                            base: 'column',
                                                            md: 'row',
                                                        }}
                                                        justifyContent={
                                                            'flex-end'
                                                        }
                                                        gap={2}
                                                        mt={{ base: 4, md: 0 }}
                                                        width="100%"
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            colorScheme="white"
                                                            borderRadius={
                                                                '37px'
                                                            }
                                                            onClick={() =>
                                                                setActiveOrder(
                                                                    order.id
                                                                )
                                                            } // Set active order on click
                                                            width={{
                                                                base: '100%',
                                                                md: 'auto',
                                                            }}
                                                        >
                                                            View Cancellation
                                                            Details
                                                        </Button>
                                                        <a
                                                            href="https://blog.hamza.market/contact/"
                                                            target="_blank"
                                                        >
                                                            <Button
                                                                ml={{
                                                                    base: 0,
                                                                    md: 2,
                                                                }}
                                                                mt={{
                                                                    base: 2,
                                                                    md: 0,
                                                                }}
                                                                variant="outline"
                                                                colorScheme="white"
                                                                borderRadius={
                                                                    '37px'
                                                                }
                                                                width={{
                                                                    base: '100%',
                                                                    md: 'auto',
                                                                }}
                                                            >
                                                                Contact Seller
                                                            </Button>
                                                        </a>
                                                    </Flex>
                                                ) : null}
                                            </Flex>
                                        </div>
                                    )
                                )}
                                <CancellationModal
                                    isOpen={activeOrder === order.id}
                                    onClose={() => setActiveOrder(null)}
                                    cancelReason={order.metadata?.cancel_reason}
                                    canceledAt={order.canceled_at}
                                />
                                <Divider
                                    width="90%"
                                    borderBottom="0.2px solid"
                                    borderColor="#D9D9D9"
                                    pr={'1rem'}
                                    _last={{
                                        mb: 8,
                                    }}
                                />
                            </Flex>
                        );
                    })}
                </Flex>
            ) : null}
        </div>
    );
};

export default Cancelled;
