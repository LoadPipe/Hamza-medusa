import React, { useState } from 'react';
import { cancelOrder } from '@/lib/server';
import {
    chainIdToName,
    getChainLogo,
} from '@modules/order/components/chain-enum/chain-enum';
import {
    Box,
    Button,
    Collapse,
    Flex,
    Text,
    VStack,
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
    Divider,
} from '@chakra-ui/react';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { format } from 'date-fns';
import EmptyState from '@modules/order/components/empty-state';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import OrderTimeline from '@modules/order/components/order-timeline';
import ProcessingOrderCard from '@modules/account/components/processing-order-card';
import Image from 'next/image';
import DynamicOrderStatus from '@modules/order/templates/dynamic-order-status';
import OrderTotalAmount from '@modules/order/templates/order-total-amount';
import OrderDetails from '@modules/order/components/order-details';
import { OrdersData, OrderNote, HistoryMeta, OrderHistory } from './all';
import { useOrderTabStore } from '@/zustand/order-tab-state';
import { upperCase } from 'lodash';
import { calculateOrderTotals } from '@/lib/util/order-calculations';

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
        mutationFn: async ({
            order_id,
            cancel_reason,
        }: {
            order_id: string;
            cancel_reason: string;
        }) => {
            return cancelOrder(order_id, cancel_reason);
        },
        onSuccess: async () => {
            try {
                // Refetch orders after a successful cancellation
                await queryClient.invalidateQueries({
                    queryKey: ['fetchAllOrders', customer],
                });

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
            {processingOrder && processingOrder.length > 0 ? (
                <Flex width={'100%'} flexDirection="column">
                    {processingOrder.map((order: any) => {
                        const {
                            subTotal,
                            orderShippingTotal,
                            orderSubTotal,
                            orderTotalPaid,
                            orderDiscountTotal,
                        } = calculateOrderTotals(order);

                        // Check if we Seller has left a `PUBLIC` note, we're only returning public notes to client.
                        const hasSellerNotes = order?.notes?.length > 0;

                        // Locate the history that contains a non-empty transaction array
                        const historyWithTransaction = order?.history?.find(
                            (history: OrderHistory) =>
                                Array.isArray(history.metadata?.transaction) &&
                                history.metadata.transaction.length > 0
                        );

                        // Then extract the transactions array if it exists
                        const transactions =
                            historyWithTransaction?.metadata?.transaction;

                        const chainId =
                            order.payments[0]?.blockchain_data
                                ?.payment_chain_id ??
                            order.payments[0]?.blockchain_data?.chain_id;

                        return (
                            <div key={order.id}>
                                {order.items?.map(
                                    (item: any, index: number) => (
                                        <div key={item.id}>
                                            {index === 0 ? (
                                                <DynamicOrderStatus
                                                    orderDate={order.created_at}
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
                                                        {order.escrow_status !==
                                                            'buyer_released' &&
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

                                                            {transactions && (
                                                                <Tab
                                                                    _selected={{
                                                                        color: 'primary.green.900',
                                                                        borderBottom:
                                                                            '2px solid',
                                                                        borderColor:
                                                                            'primary.green.900',
                                                                    }}
                                                                >
                                                                    Transaction
                                                                    History
                                                                </Tab>
                                                            )}
                                                        </TabList>
                                                        <TabPanels>
                                                            <TabPanel>
                                                                <OrderDetails
                                                                    order={
                                                                        order
                                                                    }
                                                                    subTotal={
                                                                        subTotal
                                                                    }
                                                                    orderDiscountTotal={
                                                                        orderDiscountTotal
                                                                    }
                                                                    orderShippingTotal={
                                                                        orderShippingTotal
                                                                    }
                                                                    chainId={
                                                                        chainId
                                                                    }
                                                                />
                                                            </TabPanel>
                                                            <TabPanel>
                                                                {(() => {
                                                                    console.log(
                                                                        'Order data passed to OrderTimeline:',
                                                                        {
                                                                            created_at:
                                                                                order.created_at,
                                                                            updated_at:
                                                                                order.updated_at,
                                                                            status: order.status,
                                                                            fulfillment_status:
                                                                                order.fulfillment_status,
                                                                            payment_status:
                                                                                order.payment_status,
                                                                            history:
                                                                                order.history,
                                                                            refunds:
                                                                                order.refunds,
                                                                        }
                                                                    );
                                                                    return (
                                                                        <OrderTimeline
                                                                            orderDetails={
                                                                                order
                                                                            }
                                                                        />
                                                                    );
                                                                })()}
                                                            </TabPanel>
                                                            {/* The note container */}
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

                                                            {transactions && (
                                                                <TabPanel>
                                                                    <Box
                                                                        p={8}
                                                                        mb={4}
                                                                        border="1px transparent"
                                                                        borderRadius="md"
                                                                        bg="black"
                                                                        boxShadow="sm"
                                                                        fontFamily="Inter, sans-serif"
                                                                    >
                                                                        {transactions.map(
                                                                            (
                                                                                tx: HistoryMeta,
                                                                                index: number
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        tx.transaction_id
                                                                                    }
                                                                                >
                                                                                    <Text
                                                                                        color="gray.400"
                                                                                        fontSize="sm"
                                                                                        mb={
                                                                                            2
                                                                                        }
                                                                                    >
                                                                                        {format(
                                                                                            new Date(
                                                                                                tx?.date
                                                                                            ),
                                                                                            'EEEE, MMMM d, yyyy | h:mm a'
                                                                                        )}
                                                                                    </Text>
                                                                                    <Text>
                                                                                        Transaction
                                                                                        ID:{' '}
                                                                                        {
                                                                                            tx?.transaction_id
                                                                                        }
                                                                                    </Text>
                                                                                    <Text>
                                                                                        Transaction
                                                                                        Type:{' '}
                                                                                        {
                                                                                            tx?.type
                                                                                        }
                                                                                    </Text>

                                                                                    {index <
                                                                                        transactions.length -
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
