import React, { useState } from 'react';
import { cancelOrder } from '@/lib/server';
import {
    Box,
    Button,
    Flex,
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
} from '@chakra-ui/react';
import EmptyState from '@modules/order/components/empty-state';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OrdersData } from './all';
import ProcessingOrder from './orders/processing-order';
import DeliveredOrder from './orders/delivered-order';
import RefundedOrder from './orders/refunded-order';
import CancelledOrder from './orders/cancelled-order';
import ShippedOrder from './orders/shipped-order';
import UnclassifiedOrder from './orders/unclassified-order';

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

const AllOrders = ({
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

    const queryClient = useQueryClient();
    const cachedData: OrdersData | undefined = queryClient.getQueryData([
        'batchOrders',
    ]);

    const allOrders = cachedData?.All || [];

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

    const closeModal = () => {
        setIsModalOpen(false);
        setCancelReason('');
        setIsAttemptedSubmit(false);
    };

    if (isEmpty && allOrders?.length === 0) {
        return <EmptyState />;
    }

    const processingIds = cachedData?.Processing?.map((o: any) => o.id) ?? [];
    const deliveredIds = cachedData?.Delivered?.map((o: any) => o.id) ?? [];
    const refundedIds = cachedData?.Refunded?.map((o: any) => o.id) ?? [];
    const cancelledIds = cachedData?.Cancelled?.map((o: any) => o.id) ?? [];
    const shippedIds = cachedData?.Shipped?.map((o: any) => o.id) ?? [];

    return (
        <div style={{ width: '100%' }}>
            {allOrders && allOrders.length > 0 ? (
                <Flex width={'100%'} flexDirection="column">
                    {allOrders.map((order: any) => {
                        /*
                        if (processingIds.includes(order.id))
                            return (
                                <ProcessingOrder key={order.id} order={order} />
                            );
                        if (deliveredIds.includes(order.id))
                            return (
                                <DeliveredOrder key={order.id} order={order} />
                            );
                        if (refundedIds.includes(order.id))
                            return (
                                <RefundedOrder key={order.id} order={order} />
                            );
                        if (cancelledIds.includes(order.id))
                            return (
                                <CancelledOrder key={order.id} order={order} />
                            );
                        if (shippedIds.includes(order.id))
                            return (
                                <ShippedOrder key={order.id} order={order} />
                            );
                            */

                        return (
                            <UnclassifiedOrder key={order.id} order={order} />
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

export default AllOrders;
