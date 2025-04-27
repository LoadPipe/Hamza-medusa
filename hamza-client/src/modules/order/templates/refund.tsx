import React, { useEffect, useState } from 'react';
import { getSingleBucket } from '@/lib/server';
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
    Divider,
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
import {
    chainIdToName,
    getChainLogo,
} from '@modules/order/components/chain-enum/chain-enum';
import Image from 'next/image';
import { OrderNote } from './all';
import { format } from 'date-fns';

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
                        // Check if we Seller has left a `PUBLIC` note, we're only returning public notes to client.
                        const hasSellerNotes = order?.notes?.length > 0;

                        const chainId =
                            order.payments[0]?.blockchain_data
                                ?.payment_chain_id ??
                            order.payments[0]?.blockchain_data?.chain_id;

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
                                                    {order.escrow_status &&
                                                        order.escrow_status !==
                                                            'released' && (
                                                            <Box
                                                                as="a"
                                                                href={`/account/escrow/${order.id}`}
                                                                border="1px solid"
                                                                borderColor="white"
                                                                borderRadius="37px"
                                                                color="white"
                                                                px="4"
                                                                py="2"
                                                                textAlign="center"
                                                                _hover={{
                                                                    textDecoration:
                                                                        'none',
                                                                    bg: 'primary.teal.600', // Adjust the hover color as needed
                                                                }}
                                                            >
                                                                View Escrow
                                                                Details
                                                            </Box>
                                                        )}
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
                                                                Order Details
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
                                                                Order Timeline
                                                            </Tab>
                                                            {hasSellerNotes && (
                                                                <Tab
                                                                    _selected={{
                                                                        color: 'primary.green.900',
                                                                        borderBottom:
                                                                            '2px solid',
                                                                        borderColor:
                                                                            'primary.green.900',
                                                                    }}
                                                                >
                                                                    Seller Note
                                                                </Tab>
                                                            )}
                                                        </TabList>
                                                        <TabPanels>
                                                            <TabPanel>
                                                                <VStack
                                                                    align="start"
                                                                    spacing={4}
                                                                    p={4}
                                                                    borderRadius="lg"
                                                                    w="100%"
                                                                >
                                                                    <Flex
                                                                        direction={{
                                                                            base: 'column',
                                                                            md: 'row',
                                                                        }}
                                                                        gap={6}
                                                                        w="100%"
                                                                    >
                                                                        {/* Left Column: Shipping Cost & Subtotal */}
                                                                        <VStack
                                                                            align="start"
                                                                            spacing={
                                                                                2
                                                                            }
                                                                            flex="1"
                                                                        >
                                                                            {order.tracking_number && (
                                                                                <>
                                                                                    <Text>
                                                                                        <b>
                                                                                            Tracking
                                                                                            Number:
                                                                                        </b>{' '}
                                                                                        {
                                                                                            order.tracking_number
                                                                                        }
                                                                                    </Text>
                                                                                </>
                                                                            )}
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
                                                                            <Text fontSize="md">
                                                                                <strong>
                                                                                    Subtotal:
                                                                                </strong>{' '}
                                                                                {formatCryptoPrice(
                                                                                    subTotal,
                                                                                    item.currency_code
                                                                                )}{' '}
                                                                                {upperCase(
                                                                                    item.currency_code
                                                                                )}
                                                                            </Text>
                                                                        </VStack>

                                                                        {/* Right Column: Order ID & Chain Data */}
                                                                        <VStack
                                                                            align="start"
                                                                            spacing={
                                                                                2
                                                                            }
                                                                            flex="1"
                                                                        >
                                                                            <Flex
                                                                                align="center"
                                                                                gap={
                                                                                    2
                                                                                }
                                                                            >
                                                                                <Text fontSize="md">
                                                                                    <strong>
                                                                                        Order
                                                                                        ID:
                                                                                    </strong>{' '}
                                                                                    {order?.id &&
                                                                                    typeof order.id ===
                                                                                        'string'
                                                                                        ? order.id.replace(
                                                                                              /^order_/,
                                                                                              ''
                                                                                          ) // Remove "order_" prefix
                                                                                        : 'Order ID not available'}
                                                                                </Text>
                                                                            </Flex>

                                                                            <Flex
                                                                                align="center"
                                                                                gap={
                                                                                    2
                                                                                }
                                                                            >
                                                                                <strong>
                                                                                    Order
                                                                                    Chain:
                                                                                </strong>
                                                                                <Image
                                                                                    src={getChainLogo(
                                                                                        chainId
                                                                                    )}
                                                                                    alt={chainIdToName(
                                                                                        chainId
                                                                                    )}
                                                                                    width={
                                                                                        25
                                                                                    }
                                                                                    height={
                                                                                        25
                                                                                    }
                                                                                />
                                                                                <Text>
                                                                                    {chainIdToName(
                                                                                        chainId
                                                                                    )}
                                                                                </Text>
                                                                            </Flex>
                                                                        </VStack>
                                                                    </Flex>
                                                                </VStack>
                                                            </TabPanel>
                                                            <TabPanel>
                                                                <OrderTimeline
                                                                    orderDetails={
                                                                        order
                                                                    }
                                                                />
                                                            </TabPanel>
                                                            {hasSellerNotes && (
                                                                <TabPanel>
                                                                    <Box
                                                                        mb={4}
                                                                        p={8}
                                                                        border="1px transparent"
                                                                        borderRadius="md"
                                                                        bg="black"
                                                                        boxShadow="sm"
                                                                        fontFamily="Inter, sans-serif"
                                                                    >
                                                                        {order.notes.map(
                                                                            (
                                                                                note: OrderNote,
                                                                                index: number
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        note.id
                                                                                    }
                                                                                >
                                                                                    {/* Date in smaller, gray text */}
                                                                                    <Text
                                                                                        color="gray.400"
                                                                                        fontSize="sm"
                                                                                        mb={
                                                                                            2
                                                                                        }
                                                                                    >
                                                                                        {format(
                                                                                            new Date(
                                                                                                note.updated_at
                                                                                            ),
                                                                                            'EEEE, MMMM d, yyyy | h:mm a'
                                                                                        )}
                                                                                    </Text>

                                                                                    {/* The note content */}
                                                                                    <Text color="white">
                                                                                        {
                                                                                            note.note
                                                                                        }
                                                                                    </Text>

                                                                                    {/* Divider between notes (except after the last one) */}
                                                                                    {index <
                                                                                        order
                                                                                            .notes
                                                                                            .length -
                                                                                            1 && (
                                                                                        <Divider
                                                                                            my={
                                                                                                4
                                                                                            }
                                                                                            borderColor="#272727"
                                                                                        />
                                                                                    )}
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </Box>
                                                                </TabPanel>
                                                            )}
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
