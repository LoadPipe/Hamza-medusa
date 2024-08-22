import React, { useEffect, useState } from 'react';
import { orderBucket, orderDetails, singleBucket } from '@lib/data';
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
} from '@chakra-ui/react';
import ProcessingOrderCard from '@modules/account/components/processing-order-card';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

const Processing = ({ orders }: { orders: any[] }) => {
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [isAttemptedSubmit, setIsAttemptedSubmit] = useState(false);
    const [expandViewOrder, setExpandViewOrder] = useState(false);

    const [customerOrder, setCustomerOrder] = useState<any[] | null>(null);
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

    const toggleViewOrder = () => {
        setExpandViewOrder(!expandViewOrder);
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
            const bucket = await singleBucket(customerId, 1);
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
            <h1>Processing Orders</h1>
            {customerOrder && customerOrder.length > 0 ? (
                customerOrder.map((order) => (
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
                                    <ProcessingOrderCard
                                        key={item.id}
                                        order={item}
                                        handle={
                                            item.variant?.product?.handle ||
                                            'N/A'
                                        }
                                    />
                                    <div className="flex justify-end pr-4">
                                        <Box
                                            color={'primary.green.900'}
                                            onClick={toggleViewOrder}
                                        >
                                            View Order
                                        </Box>
                                    </div>
                                    {/* Collapsible Section */}
                                    <Collapse
                                        in={expandViewOrder}
                                        animateOpacity
                                    >
                                        <Box mt={4}>
                                            <Tabs
                                                variant="soft-rounded"
                                                colorScheme="green"
                                            >
                                                <TabList>
                                                    <Tab>Order History</Tab>
                                                    <Tab>Order Details</Tab>
                                                </TabList>

                                                <TabPanels>
                                                    {/* Order History Panel */}
                                                    <TabPanel>
                                                        <VStack
                                                            align="start"
                                                            spacing={4}
                                                            p={4}
                                                            borderWidth="1px"
                                                            borderRadius="lg"
                                                            bg="gray.900"
                                                            w="100%"
                                                        >
                                                            <Text fontWeight="bold">
                                                                Order History
                                                            </Text>
                                                            <Box>
                                                                <Text>
                                                                    Order Placed
                                                                </Text>
                                                                <Text fontSize="sm">
                                                                    18/07/2024 |
                                                                    3:43 pm
                                                                </Text>
                                                            </Box>
                                                            <Box>
                                                                <Text>
                                                                    Payment
                                                                    Complete
                                                                </Text>
                                                                <Text fontSize="sm">
                                                                    18/07/2024 |
                                                                    3:43 pm
                                                                </Text>
                                                            </Box>
                                                            <Box>
                                                                <Text>
                                                                    Order
                                                                    Confirmed
                                                                </Text>
                                                                <Text fontSize="sm">
                                                                    18/07/2024 |
                                                                    3:49 pm
                                                                </Text>
                                                            </Box>
                                                            <Box>
                                                                <Text>
                                                                    Product
                                                                    Packaging
                                                                </Text>
                                                                <Text fontSize="sm">
                                                                    18/07/2024 |
                                                                    5:12 pm
                                                                </Text>
                                                            </Box>
                                                            <Box>
                                                                <Text>
                                                                    Product
                                                                    Shipped
                                                                </Text>
                                                                <Text fontSize="sm">
                                                                    18/07/2024 |
                                                                    6:12 pm
                                                                </Text>
                                                            </Box>
                                                        </VStack>
                                                    </TabPanel>

                                                    {/* Order Details Panel */}
                                                    <TabPanel>
                                                        <VStack
                                                            align="start"
                                                            spacing={4}
                                                            p={4}
                                                            borderWidth="1px"
                                                            borderRadius="lg"
                                                            bg="gray.900"
                                                            w="100%"
                                                        >
                                                            <Text fontWeight="bold">
                                                                Order Details
                                                            </Text>
                                                            <Text>
                                                                Courier: DHL
                                                                Express
                                                            </Text>
                                                            <Text>
                                                                Address:
                                                                Maharlika St,
                                                                San Fernando,
                                                                2000 Pampanga
                                                            </Text>
                                                            {/* Additional order details here */}
                                                        </VStack>
                                                    </TabPanel>
                                                </TabPanels>
                                            </Tabs>
                                        </Box>
                                    </Collapse>
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

export default Processing;
