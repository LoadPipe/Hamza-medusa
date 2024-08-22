import React, { useEffect, useState } from 'react';
import {
    orderBucket,
    orderDetails,
    singleBucket,
    cancelOrder,
} from '@lib/data';
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
} from '@chakra-ui/react';
import OrderCard from '@modules/account/components/order-card';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import CancelOrderModal from '../components/cancel-order-modal';
import { Textarea } from '@medusajs/ui';

type OrderType = {
    id: string;
    cart: any;
    cart_id: string;
    status: string;
    // include other order properties here
};

interface OrderState {
    Processing: OrderType[];
    Shipped: OrderType[];
    Delivered: OrderType[];
    Cancelled: OrderType[];
    Refunded: OrderType[];
}

const MIN_CANCEL_REASON_LENGTH = 30;

const All = ({ orders }: { orders: any[] }) => {
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [isAttemptedSubmit, setIsAttemptedSubmit] = useState(false);

    useEffect(() => {
        console.log('Current CancelReason:', cancelReason);
    }, [cancelReason]);

    const [customerOrder, setCustomerOrder] = useState<OrderState | null>({
        Processing: [],
        Shipped: [],
        Delivered: [],
        Cancelled: [],
        Refunded: [],
    });

    const openCancelModal = (orderId: string) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const closeCancelModal = () => {
        setIsModalOpen(false);
        setCancelReason('');
        setIsAttemptedSubmit(false);
    };

    useEffect(() => {
        console.log('Orders received in Processing:', orders);
        if (orders && orders.length > 0) {
            const customer_id = orders[0]?.customer_id;
            console.log(
                `Running fetchAllOrders with customerID ${customer_id}`
            );
            fetchAllOrders(customer_id);
            setCustomerId(customer_id);
        }
    }, [orders]);

    const fetchAllOrders = async (customerId: string) => {
        setIsLoading(true);
        try {
            const response = await orderBucket(customerId);
            console.log(`ALL BUCKETS`, response);

            console.log(`ToPay BUCKET ${response.ToPay}`);
            // Check if the response is valid and has the expected structure
            if (response && typeof response === 'object') {
                setCustomerOrder({
                    Processing: response.Processing || [],
                    Shipped: response.Shipped || [],
                    Delivered: response.Delivered || [],
                    Cancelled: response.Cancelled || [],
                    Refunded: response.Refunded || [],
                });
            } else {
                console.error(
                    'Expected an object with order arrays but got:',
                    response
                );
                // Maintain the structure of customerOrder even in error cases
                setCustomerOrder({
                    Processing: [],
                    Shipped: [],
                    Delivered: [],
                    Cancelled: [],
                    Refunded: [],
                });
            }
        } catch (error) {
            console.error('Error fetching order buckets:', error);
            setCustomerOrder({
                Processing: [],
                Shipped: [],
                Delivered: [],
                Cancelled: [],
                Refunded: [],
            });
        }
        setIsLoading(false);
    };

    //TODO: this is duplicated code (3x); should be DRYed (likewise with the modal itself)
    const handleCancel = async () => {
        if ((cancelReason?.length ?? 0) < MIN_CANCEL_REASON_LENGTH) {
            setIsAttemptedSubmit(true);
            return;
        }
        if (!selectedOrderId) return;

        try {
            await cancelOrder(selectedOrderId);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error cancelling order: ', error);
        }
    };

    return (
        <Box>
            {customerOrder ? (
                <Box>
                    <Box mt={4} mb={2}>
                        <Text
                            pl={4}
                            className="text-2xl-semi"
                            color={'primary.indigo.900'}
                        >
                            Processing
                        </Text>
                        {customerOrder.Processing.length > 0 ? (
                            customerOrder.Processing.map((order) => (
                                <Box
                                    key={order.id}
                                    borderBottom={'1px'}
                                    borderColor="gray.200"
                                    pb={'6'}
                                >
                                    {/* <div className="p-4 bg-gray-700">*/}
                                    {/*    Cart ID {order.cart_id} - Total Items:{' '}*/}
                                    {/*    {order.cart?.items?.length || 0}*/}
                                    {/*    <span*/}
                                    {/*        className="pl-2 text-blue-400 underline underline-offset-1 cursor-pointer"*/}
                                    {/*        onClick={() =>*/}
                                    {/*            handleReorder(order.cart?.items || [])*/}
                                    {/*        }*/}
                                    {/*    >*/}
                                    {/*        Re-order*/}
                                    {/*    </span>*/}
                                    {/*</div> */}
                                    {order.cart?.items?.map(
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
                                                <OrderCard
                                                    key={item.id}
                                                    order={item}
                                                    handle={
                                                        item.variant?.product
                                                            ?.handle || 'N/A'
                                                    }
                                                />
                                                <LocalizedClientLink
                                                    href={`/account/orders/details/${order.id}`} // Ensure order_ids exists
                                                    passHref
                                                >
                                                    <Button
                                                        variant="outline"
                                                        colorScheme="white"
                                                        borderRadius={'37px'}
                                                    >
                                                        See details
                                                    </Button>
                                                </LocalizedClientLink>
                                                {order.status === 'canceled' ? (
                                                    <Button
                                                        colorScheme="red"
                                                        ml={4}
                                                        isDisabled
                                                    >
                                                        Cancellation Requested
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        colorScheme="white"
                                                        borderRadius={'37px'}
                                                        ml={4}
                                                        onClick={() =>
                                                            openCancelModal(
                                                                order.id
                                                            )
                                                        }
                                                    >
                                                        Request Cancellation
                                                    </Button>
                                                )}
                                            </Box>
                                        )
                                    )}
                                </Box>
                            ))
                        ) : (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                width="full"
                                bg="rgba(39, 39, 39, 0.3)"
                                color="white"
                                p={8}
                            >
                                <Text fontSize="xl" fontWeight="bold">
                                    You don't have any Processing Orders yet.
                                </Text>
                            </Box>
                        )}
                    </Box>
                    <Box mt={4} mb={2}>
                        <Text
                            pl={4}
                            mb={1}
                            className="text-2xl-semi"
                            color={'primary.indigo.900'}
                        >
                            Shipped
                        </Text>
                        {customerOrder.Shipped.length > 0 ? (
                            customerOrder.Shipped.map((order) => (
                                <Box
                                    key={order.id}
                                    borderBottom={'1px'}
                                    borderColor="gray.200"
                                    pb={'6'}
                                >
                                    {/*<div className="p-4 bg-gray-700">*/}
                                    {/*    Cart ID {order.id} - Total Items:{' '}*/}
                                    {/*    {order.cart?.items?.length || 0}*/}
                                    {/*    <span*/}
                                    {/*        className="pl-2 text-blue-400 underline underline-offset-1 cursor-pointer"*/}
                                    {/*        onClick={() =>*/}
                                    {/*            handleReorder(order.cart?.items || [])*/}
                                    {/*        }*/}
                                    {/*    >*/}
                                    {/*        Re-order*/}
                                    {/*    </span>*/}
                                    {/*</div>*/}
                                    {order.cart?.items?.map(
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
                                                <OrderCard
                                                    key={item.id}
                                                    order={item}
                                                    handle={
                                                        item.variant?.product
                                                            ?.handle || 'N/A'
                                                    }
                                                />
                                                <LocalizedClientLink
                                                    href={`/account/orders/details/${order.id}`} // Ensure order_ids exists
                                                    passHref
                                                >
                                                    <Button
                                                        variant="outline"
                                                        colorScheme="white"
                                                        borderRadius={'37px'}
                                                    >
                                                        See details
                                                    </Button>
                                                </LocalizedClientLink>
                                                {order.status === 'canceled' ? (
                                                    <Button
                                                        colorScheme="red"
                                                        ml={4}
                                                        isDisabled
                                                    >
                                                        Cancellation Requested
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        colorScheme="white"
                                                        borderRadius={'37px'}
                                                        ml={4}
                                                        onClick={() =>
                                                            openCancelModal(
                                                                order.id
                                                            )
                                                        }
                                                    >
                                                        Request Cancellation
                                                    </Button>
                                                )}
                                            </Box>
                                        )
                                    )}
                                </Box>
                            ))
                        ) : (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                width="full"
                                bg="rgba(39, 39, 39, 0.3)"
                                color="white"
                                p={8}
                            >
                                <Text fontSize="xl" fontWeight="bold">
                                    You don't have any Shipped Orders yet.
                                </Text>
                            </Box>
                        )}
                    </Box>
                    <Box mt={4} mb={2}>
                        <Text
                            pl={4}
                            className="text-2xl-semi"
                            color={'primary.indigo.900'}
                        >
                            Delivered
                        </Text>
                        {customerOrder.Delivered.length > 0 ? (
                            customerOrder.Delivered.map((order) => (
                                <Box
                                    key={order.id}
                                    borderBottom={'1px'}
                                    borderColor="gray.200"
                                    pb={'6'}
                                >
                                    {/*<div className="p-4 bg-gray-700">*/}
                                    {/*    Cart ID {order.cart_id} - Total Items:{' '}*/}
                                    {/*    {order.cart?.items?.length || 0}*/}
                                    {/*    <span*/}
                                    {/*        className="pl-2 text-blue-400 underline underline-offset-1 cursor-pointer"*/}
                                    {/*        onClick={() =>*/}
                                    {/*            handleReorder(order.cart?.items || [])*/}
                                    {/*        }*/}
                                    {/*    >*/}
                                    {/*        Re-order*/}
                                    {/*    </span>*/}
                                    {/*</div>*/}
                                    {order.cart?.items?.map(
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
                                                <OrderCard
                                                    key={item.id}
                                                    order={item}
                                                    handle={
                                                        item.variant?.product
                                                            ?.handle || 'N/A'
                                                    }
                                                />
                                                <LocalizedClientLink
                                                    href={`/account/orders/details/${order.id}`} // Ensure order_ids exists
                                                    passHref
                                                >
                                                    <Button
                                                        variant="outline"
                                                        colorScheme="white"
                                                        borderRadius={'37px'}
                                                    >
                                                        See details
                                                    </Button>
                                                </LocalizedClientLink>
                                                {order.status === 'canceled' ? (
                                                    <Button
                                                        colorScheme="red"
                                                        ml={4}
                                                        isDisabled
                                                    >
                                                        Cancellation Requested
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        colorScheme="white"
                                                        borderRadius={'37px'}
                                                        ml={4}
                                                        onClick={() =>
                                                            openCancelModal(
                                                                order.id
                                                            )
                                                        }
                                                    >
                                                        Request Cancellation
                                                    </Button>
                                                )}
                                            </Box>
                                        )
                                    )}
                                </Box>
                            ))
                        ) : (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                width="full"
                                bg="rgba(39, 39, 39, 0.3)"
                                color="white"
                                p={8}
                            >
                                <Text fontSize="xl" fontWeight="bold">
                                    You don't have any Delivered Orders yet.
                                </Text>
                            </Box>
                        )}
                    </Box>
                    <Box mt={4} mb={2}>
                        <Text
                            pl={4}
                            className="text-2xl-semi"
                            color={'primary.indigo.900'}
                        >
                            Cancelled
                        </Text>
                        {customerOrder.Cancelled.length > 0 ? (
                            customerOrder.Cancelled.map((order) => (
                                <Box
                                    key={order.id}
                                    borderBottom={'1px'}
                                    borderColor="gray.200"
                                    pb={'6'}
                                >
                                    {/*<div className="p-4 bg-gray-700">*/}
                                    {/*    Cart ID {order.cart_id} - Total Items:{' '}*/}
                                    {/*    {order.cart?.items?.length || 0}*/}
                                    {/*    <span*/}
                                    {/*        className="pl-2 text-blue-400 underline underline-offset-1 cursor-pointer"*/}
                                    {/*        onClick={() =>*/}
                                    {/*            handleReorder(order.cart?.items || [])*/}
                                    {/*        }*/}
                                    {/*    >*/}
                                    {/*        Re-order*/}
                                    {/*    </span>*/}
                                    {/*</div>*/}
                                    {order.cart?.items?.map(
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
                                                <OrderCard
                                                    key={item.id}
                                                    order={item}
                                                    handle={
                                                        item.variant?.product
                                                            ?.handle || 'N/A'
                                                    }
                                                />
                                                <LocalizedClientLink
                                                    href={`/account/orders/details/${order.id}`} // Ensure order_ids exists
                                                    passHref
                                                >
                                                    <Button
                                                        variant="outline"
                                                        colorScheme="white"
                                                        borderRadius={'37px'}
                                                    >
                                                        See details
                                                    </Button>
                                                </LocalizedClientLink>
                                                {order.status === 'canceled' ? (
                                                    <Button
                                                        colorScheme="red"
                                                        ml={4}
                                                        isDisabled
                                                    >
                                                        Cancellation Requested
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        colorScheme="white"
                                                        borderRadius={'37px'}
                                                        ml={4}
                                                        onClick={() =>
                                                            openCancelModal(
                                                                order.id
                                                            )
                                                        }
                                                    >
                                                        Request Cancellation
                                                    </Button>
                                                )}
                                            </Box>
                                        )
                                    )}
                                </Box>
                            ))
                        ) : (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                width="full"
                                bg="rgba(39, 39, 39, 0.3)"
                                color="white"
                                p={8}
                            >
                                <Text fontSize="xl" fontWeight="bold">
                                    You don't have any Cancelled Orders yet.
                                </Text>
                            </Box>
                        )}
                    </Box>
                    <Box mt={4} mb={2}>
                        <Text
                            pl={4}
                            className="text-2xl-semi"
                            color={'primary.indigo.900'}
                        >
                            Refunded
                        </Text>
                        {customerOrder.Refunded.length > 0 ? (
                            customerOrder.Refunded.map((order) => (
                                <Box
                                    key={order.id}
                                    borderBottom={'1px'}
                                    borderColor="gray.200"
                                    pb={'6'}
                                >
                                    {/*<div className="p-4 bg-gray-700">*/}
                                    {/*    Cart ID {order.cart_id} - Total Items:{' '}*/}
                                    {/*    {order.cart?.items?.length || 0}*/}
                                    {/*    <span*/}
                                    {/*        className="pl-2 text-blue-400 underline underline-offset-1 cursor-pointer"*/}
                                    {/*        onClick={() =>*/}
                                    {/*            handleReorder(order.cart?.items || [])*/}
                                    {/*        }*/}
                                    {/*    >*/}
                                    {/*        Re-order*/}
                                    {/*    </span>*/}
                                    {/*</div>*/}
                                    {order.cart?.items?.map(
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
                                                <OrderCard
                                                    key={item.id}
                                                    order={item}
                                                    handle={
                                                        item.variant?.product
                                                            ?.handle || 'N/A'
                                                    }
                                                />
                                                <LocalizedClientLink
                                                    href={`/account/orders/details/${order.id}`} // Ensure order_ids exists
                                                    passHref
                                                >
                                                    <Button
                                                        variant="outline"
                                                        colorScheme="white"
                                                        borderRadius={'37px'}
                                                    >
                                                        See details
                                                    </Button>
                                                </LocalizedClientLink>
                                                {order.status === 'canceled' ? (
                                                    <Button
                                                        colorScheme="red"
                                                        ml={4}
                                                        isDisabled
                                                    >
                                                        Cancellation Requested
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        colorScheme="white"
                                                        borderRadius={'37px'}
                                                        ml={4}
                                                        onClick={() =>
                                                            openCancelModal(
                                                                order.id
                                                            )
                                                        }
                                                    >
                                                        Request Cancellation
                                                    </Button>
                                                )}
                                            </Box>
                                        )
                                    )}
                                </Box>
                            ))
                        ) : (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                width="full"
                                bg="rgba(39, 39, 39, 0.3)"
                                color="white"
                                p={8}
                            >
                                <Text fontSize="xl" fontWeight="bold">
                                    You don't have any Refunded Orders yet.
                                </Text>
                            </Box>
                        )}
                    </Box>
                </Box>
            ) : (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    width="full"
                    bg="rgba(39, 39, 39, 0.3)"
                    color="white"
                    p={8}
                >
                    <Text fontSize="xl" fontWeight="bold">
                        Nothing to see here
                    </Text>
                    <Text>
                        You don't have any orders yet, let us change that :)
                    </Text>
                    <LocalizedClientLink href="/" passHref>
                        <Button m={8} colorScheme="whiteAlpha">
                            Continue shopping
                        </Button>
                    </LocalizedClientLink>
                </Box>
            )}

            <CancelOrderModal
                isModalOpen={isModalOpen}
                closeCancelModal={closeCancelModal}
                handleCancel={handleCancel}
                cancelReason={cancelReason}
                setCancelReason={setCancelReason}
                isAttemptedSubmit={isAttemptedSubmit}
            />

            {/* <Modal isOpen={isModalOpen} onClose={closeCancelModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Request Cancellation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl
                            isInvalid={!cancelReason && isAttemptedSubmit}
                        >
                            <Textarea
                                placeholder="Reason for cancellation"
                                value={cancelReason}
                                onChange={(e) =>
                                    setCancelReason(e.target.value)
                                }
                            />
                            {(cancelReason?.length ?? 0) <
                                MIN_CANCEL_REASON_LENGTH &&
                                isAttemptedSubmit && (
                                    <FormErrorMessage>
                                        Cancellation reason is required.
                                    </FormErrorMessage>
                                )}
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onClick={closeCancelModal}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            ml={3}
                            onClick={handleCancel}
                        >
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal> */}
        </Box>
    );
};

export default All;
