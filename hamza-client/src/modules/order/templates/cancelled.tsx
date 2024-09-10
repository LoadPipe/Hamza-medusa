import React, { useEffect, useState } from 'react';
import { getSingleBucket } from '@lib/data';
import { Box, Button } from '@chakra-ui/react';
import CancelCard from '@modules/account/components/cancel-card';
import EmptyState from '@modules/order/components/empty-state';

const Cancelled = ({
    orders,
    isEmpty,
}: {
    orders: any[];
    isEmpty?: boolean;
}) => {
    const [customerOrder, setCustomerOrder] = useState<any[] | null>(null);
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log('Orders received in Cancelled:', orders);
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
            const bucket = await getSingleBucket(customerId, 4);
            if (Array.isArray(bucket)) {
                setCustomerOrder(bucket);
            } else {
                console.error('Expected an array but got:', bucket);
                setCustomerOrder([]);
            }
        } catch (error) {
            console.error('Error fetching processing orders:', error);
            setCustomerOrder([]);
        }
        setIsLoading(false);
    };

    if (isEmpty && orders?.length == 0) {
        return <EmptyState />;
    }

    return (
        <div>
            {/* Processing-specific content */}
            {customerOrder && customerOrder.length > 0 ? (
                <>
                    <h1>Cancelled Orders</h1>

                    {customerOrder.map((order) => (
                        <div
                            key={order.id} // Changed from cart_id to id since it's more reliable and unique
                            className="border-b border-gray-200 pb-6 last:pb-0 last:border-none"
                        >
                            {order.items?.map(
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
                                        <CancelCard
                                            key={item.id}
                                            order={item}
                                            handle={
                                                item.variant?.product?.handle ||
                                                'N/A'
                                            }
                                        />
                                    </Box>
                                )
                            )}
                        </div>
                    ))}
                </>
            ) : null}
        </div>
    );
};

export default Cancelled;
