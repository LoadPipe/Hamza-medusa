import React, { useEffect, useState } from 'react';
import { cancelOrder, getSingleBucket } from '@lib/data';
import {chainIdToName, getChainLogo} from '@modules/order/components/chain-enum/chain-enum';
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
import OrderTimeline from '@modules/order/components/order-timeline';
import ProcessingOrderCard from '@modules/account/components/processing-order-card';
import { BsCircleFill } from 'react-icons/bs';
import Image from 'next/image';
import DynamicOrderStatus from '@modules/order/templates/dynamic-order-status';
import OrderTotalAmount from '@modules/order/templates/order-total-amount';
import { OrdersData } from './all';
import { useOrderTabStore } from '@/zustand/order-tab-state';
import { upperCase } from 'lodash';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
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


    const orderActiveTab = useOrderTabStore((state) => state.orderActiveTab);

    const queryClient = useQueryClient();
    const cachedData: OrdersData | undefined = queryClient.getQueryData([
        'batchOrders',
    ]);

    // const {
    //     data,
    //     isLoading: processingOrdersLoading,
    //     isError: processingOrdersError,
    //     refetch,
    // } = useQuery<OrdersData>(['batchOrders']);

    const processingOrder = cachedData?.Processing || [];

    const mutation = useMutation({
        mutationFn: async ({ order_id, cancel_reason }: { order_id: string; cancel_reason: string }) => {
            return cancelOrder(order_id, cancel_reason);
        },
        onSuccess: async () => {
            try {
                // Refetch orders after a successful cancellation
                await queryClient.invalidateQueries({ queryKey: ['fetchAllOrders', customer] });

                setIsModalOpen(false);
                setSelectedOrderId(null);
            } catch (error) {
                console.error('Error invalidating queries:', error);
            }
        },
        onError: (error) => {
            console.error('Error cancelling order: ', error);
        },
    });


    // Utility function to format status values
    const formatStatus = (prefix: string, status: any) => {
        if (!status) return `${prefix} Not Available`;

        const formattedStatus = status
            .replace(/_/g, ' ')
            .split(' ')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return `${prefix} ${formattedStatus}`; // Return the final string with prefix
    };

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
        <div style={{ width: '100%' }}>
            {/*{processingOrdersLoading ? (*/}
            {/*    <Box*/}
            {/*        display="flex"*/}
            {/*        flexDirection="column"*/}
            {/*        justifyContent="center"*/}
            {/*        alignItems="center"*/}
            {/*        textAlign="center"*/}
            {/*    >*/}
            {/*        <Text color="white" fontSize="lg" mb={8}>*/}
            {/*            Loading Processing orders...*/}
            {/*        </Text>*/}
            {/*        <Spinner size={80} />*/}
            {/*    </Box>*/}
            {/*) : processingOrdersError && orderActiveTab !== 'All Orders' ? (*/}
            {/*    <Box*/}
            {/*        display="flex"*/}
            {/*        flexDirection="column"*/}
            {/*        justifyContent="center"*/}
            {/*        alignItems="center"*/}
            {/*        textAlign="center"*/}
            {/*        py={5}*/}
            {/*    >*/}
            {/*        <Text>Error fetching processing orders</Text>*/}
            {/*    </Box>*/}
            {/*) : processingOrdersError && orderActiveTab === 'All Orders' ? (*/}
            {/*    <Box*/}
            {/*        display="flex"*/}
            {/*        flexDirection="column"*/}
            {/*        justifyContent="center"*/}
            {/*        alignItems="center"*/}
            {/*        textAlign="center"*/}
            {/*        py={5}*/}
            {/*    >*/}
            {/*        <Text>Error Fetching Orders, please refresh</Text>*/}
            {/*    </Box>*/}
            {/*) :*/}
            {processingOrder && processingOrder.length > 0 ? (
                <Flex width={'100%'} flexDirection="column">
                    {processingOrder.map((order: any) => {
                        const subTotal = order.items.reduce(
                            (acc: number, item: any) =>
                                acc + item.unit_price * item.quantity,
                            0
                        );

                        return (
                            <div key={order.id}>
                                {order.items?.map(
                                    (item: any, index: number) => (
                                        <div key={item.id}>
                                            {index === 0 ? (
                                                <DynamicOrderStatus
                                                    paymentStatus={
                                                        order.payment_status
                                                    }
                                                    paymentType={'Processing'}
                                                />
                                            ) : null}
                                            {/*item: {item.id} <br />*/}
                                            <ProcessingOrderCard
                                                key={item.id}
                                                order={item}
                                                storeName={order.store.name}
                                                icon={order.store.icon}
                                                address={order.shipping_address}
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
                                                    md: 'center',
                                                }}
                                                alignItems={{
                                                    base: 'flex-start',
                                                    md: 'center',
                                                }}
                                                mb={5}
                                            >
                                                {/* Left-aligned text */}
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

                                                {/* Right-aligned buttons */}
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
                                                            borderRadius="37px"
                                                            cursor="pointer"
                                                            ml={{
                                                                base: 0,
                                                                md: 2,
                                                            }}
                                                            mt={{
                                                                base: 2,
                                                                md: 0,
                                                            }}
                                                            width={{
                                                                base: '100%',
                                                                md: 'auto',
                                                            }}
                                                            _hover={{
                                                                textDecoration:
                                                                    'underline',
                                                            }}
                                                            onClick={() =>
                                                                toggleViewOrder(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            View Order
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            colorScheme="white"
                                                            borderRadius="37px"
                                                            onClick={() =>
                                                                openModal(
                                                                    order.id
                                                                )
                                                            }
                                                        >
                                                            Request Cancellation
                                                        </Button>
                                                        {order.escrow_status && order.escrow_status !== 'released' && (
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
                                                                    textDecoration: 'none',
                                                                    bg: 'primary.teal.600', // Adjust the hover color as needed
                                                                }}
                                                            >
                                                                View Escrow Details
                                                            </Box>
                                                        )}
                                                    </Flex>
                                                ) : null}
                                            </Flex>

                                            {/* Collapsible Section */}
                                            <Collapse
                                                in={expandViewOrder === item.id}
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
                                                                    <Flex direction={{ base: "column", md: "row" }} gap={6} w="100%">
                                                                        {/* Left Column: Shipping Cost & Subtotal */}
                                                                        <VStack align="start" spacing={2} flex="1">
                                                                            {order?.shipping_methods[0]?.price && (
                                                                                <Text fontSize="md">
                                                                                    <strong>Order Shipping Cost:</strong>{' '}
                                                                                    {formatCryptoPrice(Number(order?.shipping_methods[0]?.price), item.currency_code ?? 'usdc')}{' '}
                                                                                    {upperCase(item.currency_code)}
                                                                                </Text>
                                                                            )}
                                                                            <Text fontSize="md">
                                                                                <strong>Subtotal:</strong>{' '}
                                                                                {formatCryptoPrice(subTotal, item.currency_code)}{' '}
                                                                                {upperCase(item.currency_code)}
                                                                            </Text>
                                                                        </VStack>

                                                                        {/* Right Column: Order ID & Chain Data */}
                                                                        <VStack align="start" spacing={2} flex="1">
                                                                            <Flex align="center" gap={2}>
                                                                                <Text fontSize="md">
                                                                                    <strong>Order ID:</strong>{' '}
                                                                                    {order?.id && typeof order.id === 'string'
                                                                                        ? order.id.replace(/^order_/, '') // Remove "order_" prefix
                                                                                        : 'Order ID not available'}
                                                                                </Text>
                                                                            </Flex>

                                                                            <Flex align="center" gap={2}>
                                                                                <strong>Order Chain:</strong>
                                                                                <Image
                                                                                    src={getChainLogo(order?.payments[0]?.blockchain_data?.chain_id)}
                                                                                    alt={chainIdToName(order?.payments[0]?.blockchain_data?.chain_id)}
                                                                                    width={25}
                                                                                    height={25}
                                                                                />
                                                                                <Text>
                                                                                    {chainIdToName(order?.payments[0]?.blockchain_data?.chain_id)}
                                                                                </Text>
                                                                            </Flex>
                                                                        </VStack>
                                                                    </Flex>

                                                                </VStack>
                                                            </TabPanel>
                                                        </TabPanels>
                                                    </Tabs>
                                                </Box>
                                            </Collapse>
                                        </div>
                                    )
                                )}

                                <Divider
                                    width="90%" // Line takes up 90% of the screen width
                                    borderBottom="0.2px solid"
                                    borderColor="#D9D9D9"
                                    pr={'1rem'}
                                    _last={{
                                        mt: 8,
                                        mb: 8,
                                    }}
                                />
                            </div>
                        );
                    })}
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
