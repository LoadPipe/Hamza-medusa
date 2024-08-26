import React, { useEffect, useState } from 'react';
import {
    cancelOrder,
    orderBucket,
    orderDetails,
    orderStatus,
    singleBucket,
} from '@lib/data';
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
    Icon,
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
import { BsCircleFill } from 'react-icons/bs';

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
    const [orderStatuses, setOrderStatuses] = useState<{
        [key: string]: string;
    }>({});
    const [customerOrder, setCustomerOrder] = useState<any[] | null>(null);

    // console.log(`ORDER FOR PROCESSING ${JSON.stringify(orders)}`);
    const openModal = (orderId: string) => {
        setSelectedOrderId(orderId);
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

    const handleCancel = async () => {
        if (!cancelReason) {
            setIsAttemptedSubmit(true);
            return;
        }
        if (!selectedOrderId) return;

        console.log(`selectedORDER ID ${selectedOrderId}`);
        try {
            await cancelOrder(selectedOrderId);
            setOrderStatuses((prevStatuses) => ({
                ...prevStatuses,
                [selectedOrderId]: 'canceled',
            }));
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error cancelling order: ', error);
        }
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
                console.log(`BUCKETS ${JSON.stringify(bucket)}`);
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

    useEffect(() => {
        const fetchStatuses = async () => {
            if (!customerOrder || customerOrder.length === 0) return;

            console.log(`Customer Order ${JSON.stringify(customerOrder)}`);

            const statuses = await Promise.allSettled(
                customerOrder.map(async (order) => {
                    try {
                        const statusRes = await orderStatus(order.id);
                        console.log(
                            `Fetching status for order ${order.id} StatusResponse ${statusRes.order}`
                        );
                        return {
                            orderId: order.id,
                            status: statusRes.order,
                        };
                    } catch (error) {
                        console.error(
                            `Error fetching status for order ${order.id}:`,
                            error
                        );
                        return {
                            orderId: order.id,
                            status: 'unknown',
                        };
                    }
                })
            );

            const statusMap: { [key: string]: any } = {};
            statuses.forEach((result) => {
                if (result.status === 'fulfilled') {
                    const { orderId, status } = result.value;
                    statusMap[orderId] = status;
                } else {
                    console.error(
                        `Failed to fetch status for order: ${result.reason}`
                    );
                }
            });

            console.log(
                `Fetching status for MAP: ${JSON.stringify(statusMap)}`
            );

            setOrderStatuses(statusMap);
            console.log('Order statuses: ', statusMap);
        };

        fetchStatuses();
    }, [customerOrder]);

    return (
        <div>
            {/* Processing-specific content */}
            <h1>Processing Orders</h1>
            {customerOrder && customerOrder.length > 0 ? (
                <>
                    {customerOrder.map((order) => (
                        <>
                            <div
                                key={order.id} // Changed from cart_id to id since it's more reliable and unique
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
                                            <ProcessingOrderCard
                                                key={item.id}
                                                order={item}
                                                handle={
                                                    item.variant?.product
                                                        ?.handle || 'N/A'
                                                }
                                            />

                                            <div className="flex justify-end pr-4">
                                                <Box
                                                    color={'primary.green.900'}
                                                    cursor="pointer"
                                                    _hover={{
                                                        textDecoration:
                                                            'underline',
                                                    }}
                                                    onClick={() =>
                                                        toggleViewOrder(item.id)
                                                    }
                                                >
                                                    View Order
                                                </Box>
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
                                                            {/* Order History Panel */}
                                                            <TabPanel>
                                                                <VStack
                                                                    align="start"
                                                                    spacing={4}
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
                                                                        spacing={
                                                                            4
                                                                        }
                                                                        w="100%"
                                                                    >
                                                                        {/* Example timeline event */}
                                                                        {[
                                                                            {
                                                                                status: 'Product Shipped',
                                                                                date: '18/07/2024 | 6:12 pm',
                                                                                trackingNumber:
                                                                                    '5896-0991-7811',
                                                                                warehouse:
                                                                                    'Manila Logistics',
                                                                                courier:
                                                                                    'DHL Express',
                                                                            },
                                                                            {
                                                                                status: 'Product Packaging',
                                                                                date: '18/07/2024 | 5:12 pm',
                                                                                trackingNumber:
                                                                                    '5896-0991-7811',
                                                                                warehouse:
                                                                                    'Manila Logistics',
                                                                                courier:
                                                                                    'DHL Express',
                                                                            },
                                                                            {
                                                                                status: 'Order Confirmed',
                                                                                date: '18/07/2024 | 3:49 pm',
                                                                            },
                                                                            {
                                                                                status: 'Payment Complete',
                                                                                date: '18/07/2024 | 3:43 pm',
                                                                                paymentDetails:
                                                                                    'Paid with USDC via Binance Smart Chain. Total payment: 1499.99 USDC.',
                                                                                receiptLink:
                                                                                    'View receipt',
                                                                            },
                                                                            {
                                                                                status: 'Payment On Process',
                                                                                date: '18/07/2024 | 3:43 pm',
                                                                                paymentDetails:
                                                                                    'Paid with USDC via Binance Smart Chain. Total payment: 1499.99 USDC.',
                                                                            },
                                                                            {
                                                                                status: 'Order Placed',
                                                                                date: '18/07/2024 | 3:43 pm',
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
                                                                                        {event.trackingNumber && (
                                                                                            <Text
                                                                                                fontSize="sm"
                                                                                                color="gray.400"
                                                                                            >
                                                                                                Tracking
                                                                                                Number:{' '}
                                                                                                {
                                                                                                    event.trackingNumber
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
                                                                                        {event.courier && (
                                                                                            <Text
                                                                                                fontSize="sm"
                                                                                                color="gray.400"
                                                                                            >
                                                                                                Courier:{' '}
                                                                                                {
                                                                                                    event.courier
                                                                                                }
                                                                                            </Text>
                                                                                        )}
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
                                                                                        {event.receiptLink && (
                                                                                            <Text
                                                                                                fontSize="sm"
                                                                                                color="primary.green.900"
                                                                                            >
                                                                                                {
                                                                                                    event.receiptLink
                                                                                                }
                                                                                            </Text>
                                                                                        )}
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
                                                                    <Text fontWeight="bold">
                                                                        Order
                                                                        Details
                                                                    </Text>
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
                                                                                    11
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
                                                                                <Text fontWeight="bold">
                                                                                    item_11ijnovwd124
                                                                                </Text>
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
                                                                                    Payment
                                                                                    On
                                                                                    Process
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
                                                                                    On
                                                                                    Process
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
                                                                                    Apple
                                                                                    Official
                                                                                    Store
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
                                                                            <Box>
                                                                                <Text
                                                                                    fontSize="sm"
                                                                                    color="gray.400"
                                                                                >
                                                                                    Courier:
                                                                                </Text>
                                                                                <Text fontWeight="bold">
                                                                                    DHL
                                                                                    Express
                                                                                </Text>
                                                                            </Box>
                                                                            <Box>
                                                                                <Text
                                                                                    fontSize="sm"
                                                                                    color="gray.400"
                                                                                >
                                                                                    Tracking
                                                                                    Number:
                                                                                </Text>
                                                                                <Text fontWeight="bold">
                                                                                    2856374190
                                                                                </Text>
                                                                            </Box>
                                                                            <Box>
                                                                                <Text
                                                                                    fontSize="sm"
                                                                                    color="gray.400"
                                                                                >
                                                                                    Estimated
                                                                                    Time
                                                                                    of
                                                                                    Arrival:
                                                                                </Text>
                                                                                <Text fontWeight="bold">
                                                                                    July
                                                                                    27-31,
                                                                                    2024
                                                                                </Text>
                                                                            </Box>
                                                                            <Box>
                                                                                <Text
                                                                                    fontSize="sm"
                                                                                    color="gray.400"
                                                                                >
                                                                                    Shipping
                                                                                    Information:
                                                                                </Text>
                                                                                <Text fontWeight="bold">
                                                                                    Rock
                                                                                    Rocks
                                                                                    Pa
                                                                                    Daet
                                                                                    Sub-district,
                                                                                    50100,
                                                                                    Chiang
                                                                                    Mai
                                                                                    CA
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
                                                                                    Alfred
                                                                                    Neuman
                                                                                </Text>
                                                                                <Text fontWeight="bold">
                                                                                    +01
                                                                                    1234567890
                                                                                </Text>
                                                                                <Text fontWeight="bold">
                                                                                    alfredneuman@gmail.com
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
                                    )
                                )}
                            </div>
                            <Flex
                                justifyContent="flex-end"
                                my={8}
                                gap={'4'}
                                borderBottom="1px solid"
                                borderColor="gray.200"
                                pb={6}
                                _last={{
                                    pb: 0,
                                    borderBottom: 'none',
                                }}
                            >
                                {orderStatuses[order.id] === 'canceled' ? (
                                    <Button colorScheme="red" ml={4} isDisabled>
                                        Cancellation Requested
                                    </Button>
                                ) : (
                                    <Button
                                        variant="solid"
                                        colorScheme="blue"
                                        ml={4}
                                        onClick={() => openModal(order.id)}
                                    >
                                        Request Cancellation
                                    </Button>
                                )}
                            </Flex>
                        </>
                    ))}
                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Request Cancellation</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <FormControl
                                    isInvalid={
                                        !cancelReason && isAttemptedSubmit
                                    }
                                >
                                    <Textarea
                                        placeholder="Reason for cancellation"
                                        value={cancelReason}
                                        onChange={(e) =>
                                            setCancelReason(e.target.value)
                                        }
                                    />
                                    {!cancelReason && isAttemptedSubmit && (
                                        <FormErrorMessage>
                                            Cancellation reason is required.
                                        </FormErrorMessage>
                                    )}
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="ghost" onClick={closeModal}>
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
                    </Modal>
                </>
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
