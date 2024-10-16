import React, { useEffect, useState } from 'react';
import { cancelOrder, getSingleBucket } from '@lib/data';
import {
    Box,
    Button,
    Collapse,
    Flex,
    Text,
    VStack,
    HStack,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    FormControl,
    Textarea,
    FormErrorMessage,
    ModalFooter,
    Modal,
    Icon,
    Divider,
} from '@chakra-ui/react';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import EmptyState from '@modules/order/components/empty-state';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Spinner from '@modules/common/icons/spinner';

import ProcessingOrderCard from '@modules/account/components/processing-order-card';
import { BsCircleFill } from 'react-icons/bs';
import { debounce } from 'lodash';

/**
 * The Processing component displays and manages the customer's processing orders, allowing users to view order details,
 * collapse or expand order views, and request cancellations of individual orders.
 *
 * @Author: Garo Nazarian
 *
 * Features:
 * - Fetches the customer's processing orders using `useQuery` from Tanstack React Query.
 * - Allows users to view individual order details by expanding the order view.
 * - Provides the option to request an order cancellation, with a modal for submitting the cancellation reason.
 * - Utilizes `useMutation` for handling the cancellation of orders and ensures the page refreshes after a successful cancellation.
 * - Refetches the order data after a cancellation request via query invalidation to ensure the UI is up-to-date.
 * - Displays loading spinners and handles error states during order data fetching and cancellations.
 *
 * Usage:
 * This component is used in the account section of the web app to display and manage orders that are still being processed.
 * It interacts with a backend via React Query's `useQuery` and `useMutation` for asynchronous data management.
 *
 * Main Workflow:
 * 1. Fetch processing orders for the logged-in customer on component load.
 * 2. Allow users to expand/collapse order views and see order details.
 * 3. Present a modal for submitting a cancellation reason when a user requests cancellation of an order.
 * 4. Automatically refetch the list of orders after a successful cancellation to keep the UI in sync with the backend.
 *
 * Key Components:
 * - `useQuery`: Fetches processing orders for the customer.
 * - `useMutation`: Handles order cancellation and invalidates the query to refetch data.
 * - Chakra UI components (e.g., Modal, Collapse, Tabs, Buttons) are used to structure the UI and interactions.
 * - `Spinner`: Displays a loading indicator while processing orders are being fetched.
 *
 * Edge Cases:
 * - Handles scenarios where no orders are available (shows an empty state).
 * - Ensures the cancellation modal doesn't close prematurely unless the cancellation succeeds.
 */

const Processing = ({
    customer,
    // onSuccess,
    isEmpty,
}: {
    customer: string;
    // onSuccess?: () => void;
    isEmpty?: boolean;
}) => {
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [isAttemptedSubmit, setIsAttemptedSubmit] = useState(false);
    const [expandViewOrder, setExpandViewOrder] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);

    // const debouncedOnSuccess = debounce(() => {
    //     onSuccess && onSuccess(); // Call the parent onSuccess after debounce delay
    // }, 1000); // 1000ms (1 second) delay

    const queryClient = useQueryClient();

    const {
        data: processingOrder,
        isLoading: processingOrdersLoading,
        isError: processingOrdersError,
        isFetching,
        failureCount,
        isStale,
        isSuccess,
        refetch,
    } = useQuery(
        ['fetchProcessingOrder', customer],
        () => getSingleBucket(customer, 1),
        {
            enabled: !!customer,
            retry: true,
            refetchOnWindowFocus: true,
        }
    );

    useEffect(() => {
        const retryFetch = async () => {
            if (isStale && processingOrder == undefined) {
                for (let i = 0; i < 5; i++) {
                    if (processingOrder == undefined) {
                        queryClient.resetQueries(['fetchProcessingOrder']);
                        queryClient.invalidateQueries(['fetchProcessingOrder']);
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
    //     if (isSuccess && processingOrder && processingOrder.length > 0) {
    //         console.log(`TRIGGER`);
    //         debouncedOnSuccess();
    //     }
    // }, [isSuccess]);

    // Log the queries for processing state and data
    console.log({
        template: 'PROCESSING',
        processingOrdersLoading,
        processingOrdersError,
        isFetching,
        failureCount,
        processingOrder,
        isStale,
    });

    const mutation = useMutation(
        ({
            order_id,
            cancel_reason,
        }: {
            order_id: string;
            cancel_reason: string;
        }) => cancelOrder(order_id, cancel_reason),
        {
            onSuccess: async () => {
                try {
                    // Refetch orders after a successful cancellation
                    await queryClient.invalidateQueries([
                        'fetchAllOrders',
                        customer,
                    ]);
                    refetch();

                    setIsModalOpen(false);
                    setSelectedOrderId(null);
                } catch (error) {
                    console.error('Error invalidating queries:', error);
                }
            },
            onError: (error) => {
                console.error('Error cancelling order: ', error);
            },
        }
    );

    const handleCancel = async () => {
        if (!cancelReason) {
            setIsAttemptedSubmit(true);
            return;
        }
        if (!selectedOrderId) return;

        // Pass both order_id and cancel_reason to the mutation
        mutation.mutate({
            order_id: selectedOrderId,
            cancel_reason: cancelReason,
        });
    };

    const openModal = (orderId: string) => {
        setSelectedOrderId(orderId);
        setCancelReason(''); // Ensure cancel reason is cleared here
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setCancelReason('');
        setIsAttemptedSubmit(false);
    };

    const toggleViewOrder = (orderId: any) => {
        setExpandViewOrder(expandViewOrder === orderId ? null : orderId);
    };

    // **** DO NOT REMOVE ***** Order history commented out atm so this is not in use **** DO NOT REMOVE *****
    const getAmount = (amount?: number | null, currency_code?: string) => {
        if (amount === null || amount === undefined) {
            return;
        }

        return formatCryptoPrice(amount, currency_code || 'USDC');
    };

    if (isEmpty && processingOrder?.length === 0) {
        return <EmptyState />;
    }

    return (
        <div>
            {processingOrdersLoading ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    textAlign="center"
                >
                    <Text color="white" fontSize="lg" mb={8}>
                        Loading Processing orders...
                    </Text>
                    <Spinner size={80} />
                </Box>
            ) : processingOrdersError ? (
                <Text>Error fetching processing orders</Text>
            ) : processingOrder && processingOrder.length > 0 ? (
                <Flex width={'100%'} flexDirection="column">
                    <Text
                        fontSize={'16px'}
                        color={'primary.green.900'}
                        fontWeight="bold"
                        ml={'auto'}
                    >
                        Processing
                    </Text>

                    {processingOrder.map((order: any) => (
                        <>
                            <div key={order.id}>
                                {order.items?.map((item: any) => (
                                    <Box key={item.id}>
                                        {/*item: {item.id} <br />*/}
                                        <ProcessingOrderCard
                                            key={item.id}
                                            order={item}
                                            vendorName={order.store.name}
                                            address={order.shipping_address}
                                            handle={
                                                item.variant?.product?.handle ||
                                                'N/A'
                                            }
                                        />

                                        <div className="flex justify-end pr-4 mt-4">
                                            <Button
                                                variant="outline"
                                                colorScheme="white"
                                                borderRadius={'37px'}
                                                cursor="pointer"
                                                _hover={{
                                                    textDecoration: 'underline',
                                                }}
                                                onClick={() =>
                                                    toggleViewOrder(item.id)
                                                }
                                            >
                                                View Order
                                            </Button>
                                        </div>
                                        {/* Collapsible Section */}
                                        <Collapse
                                            in={expandViewOrder === item.id}
                                            animateOpacity
                                        >
                                            <Box mt={4}>
                                                <Tabs
                                                    variant="unstyled"
                                                    colorScheme={'green'}
                                                >
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
                                                            Order History
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
                                                        Order History Panel
                                                        <TabPanel>
                                                            <VStack
                                                                align="start"
                                                                spacing={4}
                                                                flexWrap="wrap"
                                                                p={4}
                                                                borderRadius="lg"
                                                                w="100%"
                                                            >
                                                                <Text fontWeight="bold">
                                                                    Order
                                                                    History
                                                                </Text>
                                                                <VStack
                                                                    align="start"
                                                                    spacing={4}
                                                                    w="100%"
                                                                >
                                                                    {/* Example timeline event */}
                                                                    {[
                                                                        {
                                                                            status: `Shipment Status:  ${order.fulfillment_status}`,
                                                                            date: order
                                                                                .bucky_metadata
                                                                                ?.tracking
                                                                                ?.data
                                                                                ?.soOrderInfo
                                                                                ?.createTime
                                                                                ? new Date(
                                                                                      order.bucky_metadata.tracking.data.soOrderInfo.createTime
                                                                                  ).toLocaleString(
                                                                                      undefined,
                                                                                      {
                                                                                          year: 'numeric',
                                                                                          month: 'long',
                                                                                          day: 'numeric',
                                                                                          hour: '2-digit',
                                                                                          minute: '2-digit',
                                                                                          second: '2-digit',
                                                                                      }
                                                                                  )
                                                                                : 'Date not available',
                                                                            shopOrderNo:
                                                                                order
                                                                                    .bucky_metadata
                                                                                    ?.data
                                                                                    ?.shopOrderNo ||
                                                                                'N/A',
                                                                            warehouse:
                                                                                order
                                                                                    .bucky_metadata
                                                                                    ?.tracking
                                                                                    ?.data
                                                                                    ?.poOrderList[0]
                                                                                    ?.warehouseName ||
                                                                                'N/A',

                                                                            courier:
                                                                                'DHL Express',
                                                                        },
                                                                        // {
                                                                        //     status: 'Product Packaging',
                                                                        //     date: '18/07/2024 | 5:12 pm',
                                                                        //     trackingNumber:
                                                                        //         '5896-0991-7811',
                                                                        //     warehouse:
                                                                        //         'Manila Logistics',
                                                                        //     courier:
                                                                        //         'DHL Express',
                                                                        // },
                                                                        {
                                                                            status: `Order Confirmation: \t ${order.status}`,
                                                                            // date: `${new Date(
                                                                            //     order.created_at
                                                                            // ).toLocaleDateString(
                                                                            //     undefined,
                                                                            //     {
                                                                            //         year: 'numeric',
                                                                            //         month: '2-digit',
                                                                            //         day: '2-digit',
                                                                            //         hour: '2-digit',
                                                                            //         minute: '2-digit',
                                                                            //         second: '2-digit',
                                                                            //         hour12: true,
                                                                            //     }
                                                                            // )}`,
                                                                        },
                                                                        {
                                                                            status: `Payment Status: \t${order.payment_status}`,
                                                                            // date: `${new Date(
                                                                            //     order.created_at
                                                                            // ).toLocaleDateString(
                                                                            //     undefined,
                                                                            //     {
                                                                            //         year: 'numeric',
                                                                            //         month: '2-digit',
                                                                            //         day: '2-digit',
                                                                            //         hour: '2-digit',
                                                                            //         minute: '2-digit',
                                                                            //         second: '2-digit',
                                                                            //         hour12: true,
                                                                            //     }
                                                                            // )}`,
                                                                            paymentDetails: `Paid with ${item.currency_code.toUpperCase()}. Total payment: ${getAmount(item.unit_price, item.currency_code)} ${item.currency_code.toUpperCase()}`,
                                                                            // receiptLink:
                                                                            //     'View receipt',
                                                                        },

                                                                        {
                                                                            status: 'Order Placed',
                                                                            date: `${new Date(
                                                                                item.created_at
                                                                            ).toLocaleDateString(
                                                                                undefined,
                                                                                {
                                                                                    year: 'numeric',
                                                                                    month: '2-digit',
                                                                                    day: '2-digit',
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit',
                                                                                    second: '2-digit',
                                                                                    hour12: true,
                                                                                }
                                                                            )}`,
                                                                        },
                                                                    ].map(
                                                                        (
                                                                            event,
                                                                            index
                                                                        ) => (
                                                                            <HStack
                                                                                key={
                                                                                    index
                                                                                }
                                                                                align="start"
                                                                                w="100%"
                                                                            >
                                                                                {/* Circle icon */}
                                                                                <Icon
                                                                                    as={
                                                                                        BsCircleFill
                                                                                    }
                                                                                    color="primary.green.900"
                                                                                    boxSize={
                                                                                        3
                                                                                    } // Adjust size as needed
                                                                                    position="relative"
                                                                                    top="6px" // Move the icon down by 4px (adjust this value to align with status text)
                                                                                />

                                                                                <VStack
                                                                                    align="start"
                                                                                    spacing={
                                                                                        1
                                                                                    }
                                                                                    pl={
                                                                                        2
                                                                                    }
                                                                                >
                                                                                    <Text fontWeight="bold">
                                                                                        {
                                                                                            event.status
                                                                                        }
                                                                                    </Text>
                                                                                    <Text fontSize="sm">
                                                                                        {
                                                                                            event.date
                                                                                        }
                                                                                    </Text>
                                                                                    {event.shopOrderNo && (
                                                                                        <Text
                                                                                            fontSize="sm"
                                                                                            color="gray.400"
                                                                                        >
                                                                                            Shop
                                                                                            Order
                                                                                            Number:{' '}
                                                                                            {
                                                                                                event.shopOrderNo
                                                                                            }
                                                                                        </Text>
                                                                                    )}
                                                                                    {event.warehouse && (
                                                                                        <Text
                                                                                            fontSize="sm"
                                                                                            color="gray.400"
                                                                                        >
                                                                                            Warehouse:{' '}
                                                                                            {
                                                                                                event.warehouse
                                                                                            }
                                                                                        </Text>
                                                                                    )}
                                                                                    {/*{event.courier && (*/}
                                                                                    {/*    <Text*/}
                                                                                    {/*        fontSize="sm"*/}
                                                                                    {/*        color="gray.400"*/}
                                                                                    {/*    >*/}
                                                                                    {/*        Courier:{' '}*/}
                                                                                    {/*        {*/}
                                                                                    {/*            event.courier*/}
                                                                                    {/*        }*/}
                                                                                    {/*    </Text>*/}
                                                                                    {/*)}*/}
                                                                                    {event.paymentDetails && (
                                                                                        <Text
                                                                                            fontSize="sm"
                                                                                            color="gray.400"
                                                                                        >
                                                                                            {
                                                                                                event.paymentDetails
                                                                                            }
                                                                                        </Text>
                                                                                    )}
                                                                                    {/*{event.receiptLink && (*/}
                                                                                    {/*    <Text*/}
                                                                                    {/*        fontSize="sm"*/}
                                                                                    {/*        color="primary.green.900"*/}
                                                                                    {/*    >*/}
                                                                                    {/*        {*/}
                                                                                    {/*            event.receiptLink*/}
                                                                                    {/*        }*/}
                                                                                    {/*    </Text>*/}
                                                                                    {/*)}*/}
                                                                                </VStack>
                                                                            </HStack>
                                                                        )
                                                                    )}
                                                                </VStack>
                                                            </VStack>
                                                        </TabPanel>
                                                        {/* Order Details Panel */}
                                                        <TabPanel>
                                                            <VStack
                                                                align="start"
                                                                spacing={4}
                                                                p={4}
                                                                borderRadius="lg"
                                                                w="100%"
                                                            >
                                                                <HStack
                                                                    w="100%"
                                                                    justifyContent="space-between"
                                                                >
                                                                    {/* Left Column */}
                                                                    <VStack
                                                                        align="start"
                                                                        spacing={
                                                                            4
                                                                        }
                                                                    >
                                                                        <Box>
                                                                            <Text
                                                                                fontSize="sm"
                                                                                color="gray.400"
                                                                            >
                                                                                Order
                                                                                Date:
                                                                            </Text>
                                                                            <Text fontWeight="bold">
                                                                                {new Date(
                                                                                    item.created_at
                                                                                ).toLocaleDateString()}
                                                                            </Text>
                                                                        </Box>

                                                                        <Box>
                                                                            <Text
                                                                                fontSize="sm"
                                                                                color="gray.400"
                                                                            >
                                                                                Order
                                                                                Number:
                                                                            </Text>
                                                                            <Text fontWeight="bold">
                                                                                {
                                                                                    order.display_id
                                                                                }
                                                                            </Text>
                                                                        </Box>
                                                                        <Box>
                                                                            <Text
                                                                                fontSize="sm"
                                                                                color="gray.400"
                                                                            >
                                                                                Item
                                                                                ID:
                                                                            </Text>
                                                                            <Flex flexWrap="wrap">
                                                                                <Text fontWeight="bold">
                                                                                    {
                                                                                        item.id
                                                                                    }
                                                                                </Text>
                                                                            </Flex>
                                                                        </Box>
                                                                        <Box>
                                                                            <Text
                                                                                fontSize="sm"
                                                                                color="gray.400"
                                                                            >
                                                                                Order
                                                                                ID:
                                                                            </Text>
                                                                            <Flex flexWrap="wrap">
                                                                                <Text fontWeight="bold">
                                                                                    {
                                                                                        order.id
                                                                                    }
                                                                                </Text>
                                                                            </Flex>
                                                                        </Box>
                                                                        <Box>
                                                                            <Text
                                                                                fontSize="sm"
                                                                                color="gray.400"
                                                                            >
                                                                                Quantity:
                                                                            </Text>
                                                                            <Text fontWeight="bold">
                                                                                {
                                                                                    item.quantity
                                                                                }
                                                                            </Text>
                                                                        </Box>
                                                                        <Box>
                                                                            <Text
                                                                                fontSize="sm"
                                                                                color="gray.400"
                                                                            >
                                                                                Order
                                                                                Status:
                                                                            </Text>
                                                                            <Text fontWeight="bold">
                                                                                {
                                                                                    order.status
                                                                                }
                                                                            </Text>
                                                                        </Box>
                                                                        <Box>
                                                                            <Text
                                                                                fontSize="sm"
                                                                                color="gray.400"
                                                                            >
                                                                                Payment
                                                                                Status:
                                                                            </Text>
                                                                            <Text fontWeight="bold">
                                                                                {
                                                                                    order.payment_status
                                                                                }
                                                                            </Text>
                                                                        </Box>
                                                                        <Box>
                                                                            <Text
                                                                                fontSize="sm"
                                                                                color="gray.400"
                                                                            >
                                                                                Vendor:
                                                                            </Text>
                                                                            <Text fontWeight="bold">
                                                                                {
                                                                                    order
                                                                                        .store
                                                                                        .name
                                                                                }
                                                                            </Text>
                                                                        </Box>
                                                                    </VStack>

                                                                    {/* Right Column */}
                                                                    <VStack
                                                                        align="start"
                                                                        spacing={
                                                                            4
                                                                        }
                                                                    >
                                                                        {/*<Box>*/}
                                                                        {/*    <Text*/}
                                                                        {/*        fontSize="sm"*/}
                                                                        {/*        color="gray.400"*/}
                                                                        {/*    >*/}
                                                                        {/*        Courier:*/}
                                                                        {/*    </Text>*/}
                                                                        {/*    <Text fontWeight="bold">*/}
                                                                        {/*        DHL*/}
                                                                        {/*        Express*/}
                                                                        {/*    </Text>*/}
                                                                        {/*</Box>*/}
                                                                        {/*<Box>*/}
                                                                        {/*    <Text*/}
                                                                        {/*        fontSize="sm"*/}
                                                                        {/*        color="gray.400"*/}
                                                                        {/*    >*/}
                                                                        {/*        Tracking*/}
                                                                        {/*        Number:*/}
                                                                        {/*    </Text>*/}
                                                                        {/*    <Text fontWeight="bold">*/}
                                                                        {/*        2856374190*/}
                                                                        {/*    </Text>*/}
                                                                        {/*</Box>*/}
                                                                        {/*<Box>*/}
                                                                        {/*    <Text*/}
                                                                        {/*        fontSize="sm"*/}
                                                                        {/*        color="gray.400"*/}
                                                                        {/*    >*/}
                                                                        {/*        Estimated*/}
                                                                        {/*        Time*/}
                                                                        {/*        of*/}
                                                                        {/*        Arrival:*/}
                                                                        {/*    </Text>*/}
                                                                        {/*    <Text fontWeight="bold">*/}
                                                                        {/*        July*/}
                                                                        {/*        27-31,*/}
                                                                        {/*        2024*/}
                                                                        {/*    </Text>*/}
                                                                        {/*</Box>*/}
                                                                        <Box>
                                                                            <Text
                                                                                fontSize="sm"
                                                                                color="gray.400"
                                                                            >
                                                                                Shipping
                                                                                Information:
                                                                            </Text>
                                                                            <Text fontWeight="bold">
                                                                                {
                                                                                    order
                                                                                        ?.shipping_address
                                                                                        ?.address_1
                                                                                }{' '}
                                                                                {
                                                                                    order
                                                                                        ?.shipping_address
                                                                                        ?.city
                                                                                }{' '}
                                                                                {
                                                                                    order
                                                                                        ?.shipping_address
                                                                                        ?.province
                                                                                }{' '}
                                                                                {
                                                                                    order
                                                                                        ?.shipping_address
                                                                                        ?.postal_code
                                                                                }{' '}
                                                                                {
                                                                                    order
                                                                                        ?.shipping_address
                                                                                        ?.country_code
                                                                                }
                                                                            </Text>
                                                                        </Box>
                                                                        <Box>
                                                                            <Text
                                                                                fontSize="sm"
                                                                                color="gray.400"
                                                                            >
                                                                                Contact
                                                                                Information:
                                                                            </Text>
                                                                            <Text fontWeight="bold">
                                                                                {
                                                                                    order
                                                                                        ?.shipping_address
                                                                                        ?.first_name
                                                                                }{' '}
                                                                                {
                                                                                    order
                                                                                        ?.shipping_address
                                                                                        ?.last_name
                                                                                }
                                                                            </Text>
                                                                            <Text fontWeight="bold">
                                                                                {
                                                                                    order
                                                                                        ?.shipping_address
                                                                                        ?.phone
                                                                                }
                                                                            </Text>
                                                                            <Text fontWeight="bold">
                                                                                {order.customer?.email?.endsWith(
                                                                                    '@evm.blockchain'
                                                                                )
                                                                                    ? ''
                                                                                    : order
                                                                                          ?.customer
                                                                                          ?.email}
                                                                            </Text>
                                                                        </Box>
                                                                    </VStack>
                                                                </HStack>
                                                            </VStack>
                                                        </TabPanel>
                                                    </TabPanels>
                                                </Tabs>
                                            </Box>
                                        </Collapse>
                                    </Box>
                                ))}
                            </div>
                            <>
                                {order.items && order.items.length > 0 && (
                                    <>
                                        <Flex
                                            justifyContent="flex-end"
                                            my={5}
                                            mr={6}
                                        >
                                            {order.status === 'canceled' ? (
                                                <Button
                                                    colorScheme="red"
                                                    isDisabled
                                                >
                                                    Cancellation Requested
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    colorScheme="white"
                                                    borderRadius={'37px'}
                                                    onClick={() =>
                                                        openModal(order.id)
                                                    }
                                                >
                                                    Request Cancellation
                                                </Button>
                                            )}
                                        </Flex>

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
                                    </>
                                )}
                            </>
                        </>
                    ))}
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Request Cancellation</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <FormControl
                                    isInvalid={cancelReason.trim().length < 50}
                                >
                                    <Textarea
                                        placeholder="Reason for cancellation"
                                        value={cancelReason}
                                        onChange={(e) =>
                                            setCancelReason(e.target.value)
                                        }
                                    />
                                    {/* Show error message if the input is under 50 characters */}
                                    {cancelReason.trim().length > 0 &&
                                        cancelReason.trim().length < 50 && (
                                            <FormErrorMessage>
                                                Cancellation reason must be at
                                                least 50 characters long.
                                            </FormErrorMessage>
                                        )}
                                    {/* Show error message if no reason is provided when attempting to submit */}
                                    {!cancelReason && isAttemptedSubmit && (
                                        <FormErrorMessage>
                                            Cancellation reason is required.
                                        </FormErrorMessage>
                                    )}
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    variant="solid"
                                    borderColor={'primary.indigo.900'}
                                    color={'primary.indigo.900'}
                                    width={'180px'}
                                    height={'47px'}
                                    borderRadius={'37px'}
                                    onClick={closeModal}
                                >
                                    Cancel
                                </Button>
                                <Box
                                    as="button"
                                    borderRadius={'37px'}
                                    backgroundColor={
                                        cancelReason.trim().length < 50
                                            ? 'gray.400'
                                            : 'primary.indigo.900'
                                    }
                                    color={'white'}
                                    fontSize={'18px'}
                                    fontWeight={600}
                                    height={'47px'}
                                    width={'180px'}
                                    ml={'20px'}
                                    onClick={handleCancel}
                                    disabled={cancelReason.trim().length < 50}
                                >
                                    Submit
                                </Box>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Flex>
            ) : null}
        </div>
    );
};

export default Processing;
