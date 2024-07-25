import React, { useEffect, useState } from 'react';
import { orderBucket, orderDetails, singleBucket } from '@lib/data';
import { Box, Button } from '@chakra-ui/react';
import OrderCard from '@modules/account/components/order-card';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
type OrderType = {
    id: string;
    cart: any;
    cart_id: string;
    // include other order properties here
};
interface OrderState {
    ToPay: OrderType[];
    ToShip: OrderType[];
    ToReceive: OrderType[];
    Completed: OrderType[];
    Cancelled: OrderType[];
    Refunded: OrderType[];
}
const All = ({ orders }: { orders: any[] }) => {
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [isAttemptedSubmit, setIsAttemptedSubmit] = useState(false);

    const [customerOrder, setCustomerOrder] = useState<OrderState | null>({
        ToPay: [],
        ToShip: [],
        ToReceive: [],
        Completed: [],
        Cancelled: [],
        Refunded: [],
    });
    const [orderStatuses, setOrderStatuses] = useState<{
        [key: string]: string;
    }>({});

    const openModal = (orderId: string) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setCancelReason('');
        setIsAttemptedSubmit(false);
    };
    useEffect(() => {
        console.log('Orders received in Processing:', orders);
        if (orders && orders.length > 0) {
            const customer_id = orders[0].customer_id;
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
                    ToPay: response.ToPay || [],
                    ToShip: response.ToShip || [],
                    ToReceive: response.ToReceive || [],
                    Completed: response.Completed || [],
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
                    ToPay: [],
                    ToShip: [],
                    ToReceive: [],
                    Completed: [],
                    Cancelled: [],
                    Refunded: [],
                });
            }
        } catch (error) {
            console.error('Error fetching order buckets:', error);
            setCustomerOrder({
                ToPay: [],
                ToShip: [],
                ToReceive: [],
                Completed: [],
                Cancelled: [],
                Refunded: [],
            });
        }
        setIsLoading(false);
    };

    return (
        <div>
            {/* Processing-specific content */}
            <h1>Processing Orders</h1>
            {customerOrder && customerOrder.ToPay.length > 0 ? (
                customerOrder.ToPay.map((order) => (
                    <div
                        key={order.id} // Changed from cart_id to id since it's more reliable and unique
                        className="border-b border-gray-200 pb-6 last:pb-0 last:border-none"
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
                                            item.variant?.product?.handle ||
                                            'N/A'
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
                                    {orderStatuses[order.cart_id] ===
                                    'canceled' ? (
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
                                                openModal(order.cart_id)
                                            }
                                        >
                                            Request Cancellation
                                        </Button>
                                    )}
                                </Box>
                            )
                        )}
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center w-full bg-black text-white p-8">
                    <h2>Nothing to see here</h2>
                    <p>You don't have any orders yet, let us change that :)</p>
                    <LocalizedClientLink href="/" passHref>
                        <Button>Continue shopping</Button>
                    </LocalizedClientLink>
                </div>
            )}
        </div>
    );
};

export default All;
