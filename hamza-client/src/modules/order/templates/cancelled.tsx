import React, { useEffect, useState } from 'react';
import { singleBucket } from '@lib/data';
import {
    Box,
    Button,
    Collapse,
    HStack,
    Icon,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
} from '@chakra-ui/react';
import ProcessingOrderCard from '@modules/account/components/processing-order-card';
import { BsCircleFill } from 'react-icons/bs';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

const Cancelled = ({ orders }: { orders: any[] }) => {
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
            const bucket = await singleBucket(customerId, 4);
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

    return (
        <div>
            {/* Processing-specific content */}
            <h1>Cancelled Orders</h1>
            {customerOrder && customerOrder.length > 0 ? (
                customerOrder.map((order) => (
                    <div
                        key={order.id} // Changed from cart_id to id since it's more reliable and unique
                        className="border-b border-gray-200 pb-6 last:pb-0 last:border-none"
                    >
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
                                    <ProcessingOrderCard
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

export default Cancelled;
