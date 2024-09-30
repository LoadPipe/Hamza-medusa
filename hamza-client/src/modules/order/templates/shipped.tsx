import React, { useEffect, useState } from 'react';
import { getSingleBucket } from '@lib/data';
import {
    Box,
    Collapse,
    Flex,
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
import { BsCircleFill } from 'react-icons/bs';
import ShippedCard from '@modules/account/components/shipped-card';
import EmptyState from '@modules/order/components/empty-state';

const Shipped = ({
    customer,
    isEmpty,
}: {
    customer: string;
    isEmpty?: boolean;
}) => {
    const [customerOrder, setCustomerOrder] = useState<any[]>([]);
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [courierInfo, setCourierInfo] = useState(false);

    useEffect(() => {
        // console.log('Orders received in Cancelled:', orders);
        if (customer && customer.length > 0) {
            const customer_id = customer;
            // console.log(
            //     `Running fetchAllOrders with customerID ${customer_id}`
            // );
            fetchAllOrders(customer_id);
            setCustomerId(customer_id);
        }
    }, [customer]);

    const toggleCourierInfo = (orderId: any) => {
        setCourierInfo(courierInfo === orderId ? null : orderId);
    };

    const fetchAllOrders = async (customerId: string) => {
        setIsLoading(true);
        try {
            const bucket = await getSingleBucket(customerId, 2);
            if (bucket === undefined || bucket === null) {
                console.error('Bucket is undefined or null');
                setCustomerOrder([]); // Set empty state
                setIsLoading(false);
                return;
            }
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

    if (isEmpty && customerOrder && customerOrder?.length == 0) {
        return <EmptyState />;
    }
    return (
        <div>
            {/* Processing-specific content */}
            {customerOrder && customerOrder.length > 0 ? (
                <>
                    <h1>Shipped Orders</h1>

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
                                        <ShippedCard
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
                                                cursor="pointer"
                                                _hover={{
                                                    textDecoration: 'underline',
                                                }}
                                                onClick={() =>
                                                    toggleCourierInfo(item.id)
                                                }
                                            >
                                                Track Courier
                                            </Box>
                                        </div>
                                        <Collapse
                                            in={courierInfo === item.id}
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
                                                            Order Update
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
                                                            Item Details
                                                        </Tab>
                                                    </TabList>
                                                    <TabPanels>
                                                        <TabPanel>
                                                            <HStack
                                                                align="start"
                                                                spacing={3}
                                                                w="100%"
                                                            >
                                                                {' '}
                                                                {/* Align icon and text block horizontally */}
                                                                {/* Left Column: Icon */}
                                                                <Icon
                                                                    as={
                                                                        BsCircleFill
                                                                    }
                                                                    color="primary.green.900"
                                                                    boxSize={3} // Adjust size as needed
                                                                    mt={1} // Optional: Adjust this to vertically center the icon with the text
                                                                />
                                                                {/* Right Column: Text */}
                                                                <VStack
                                                                    align="start"
                                                                    spacing={2}
                                                                >
                                                                    {' '}
                                                                    {/* Stack text vertically */}
                                                                    <Flex alignItems="center">
                                                                        <Text
                                                                            fontWeight="bold"
                                                                            mr={
                                                                                2
                                                                            }
                                                                        >
                                                                            Shipped
                                                                            on
                                                                            Date:
                                                                        </Text>
                                                                        <Text>
                                                                            {order
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
                                                                                : 'Date not available'}
                                                                        </Text>
                                                                    </Flex>
                                                                    <Text fontSize="16px">
                                                                        <strong>
                                                                            Order
                                                                            Created:
                                                                        </strong>{' '}
                                                                        {order?.created_at
                                                                            ? new Date(
                                                                                  order.created_at
                                                                              ).toLocaleDateString(
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
                                                                            : 'N/A'}
                                                                    </Text>
                                                                    <Text>
                                                                        <strong>
                                                                            Shop
                                                                            Order
                                                                            Number:
                                                                        </strong>{' '}
                                                                        {order
                                                                            .bucky_metadata
                                                                            ?.data
                                                                            ?.shopOrderNo ||
                                                                            'N/A'}
                                                                    </Text>
                                                                </VStack>
                                                            </HStack>
                                                        </TabPanel>

                                                        <TabPanel>
                                                            <VStack
                                                                align="start"
                                                                spacing={4}
                                                                p={4}
                                                                borderRadius="lg"
                                                                w="100%"
                                                            >
                                                                <VStack
                                                                    align="start"
                                                                    spacing={2}
                                                                >
                                                                    <Text fontSize="md">
                                                                        <strong>
                                                                            Product
                                                                            Name:
                                                                        </strong>{' '}
                                                                        {order
                                                                            .bucky_metadata
                                                                            ?.data
                                                                            ?.productList[0]
                                                                            ?.productName ||
                                                                            'N/A'}
                                                                    </Text>
                                                                    <Text fontSize="md">
                                                                        <strong>
                                                                            Quantity:
                                                                        </strong>{' '}
                                                                        {order
                                                                            .bucky_metadata
                                                                            ?.data
                                                                            ?.productList[0]
                                                                            ?.productCount ||
                                                                            'N/A'}
                                                                    </Text>
                                                                    <Text fontSize="md">
                                                                        <strong>
                                                                            Price:
                                                                        </strong>{' '}
                                                                        ¥
                                                                        {order
                                                                            .bucky_metadata
                                                                            ?.data
                                                                            ?.productList[0]
                                                                            ?.productPrice ||
                                                                            'N/A'}{' '}
                                                                        {order
                                                                            .bucky_metadata
                                                                            ?.data
                                                                            .currency ||
                                                                            'N/A'}
                                                                    </Text>
                                                                    <Text fontSize="md">
                                                                        <strong>
                                                                            Platform:
                                                                        </strong>{' '}
                                                                        {order
                                                                            .bucky_metadata
                                                                            ?.data
                                                                            ?.productList[0]
                                                                            ?.platform ||
                                                                            'N/A'}
                                                                    </Text>
                                                                </VStack>
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
                    ))}
                </>
            ) : null}
        </div>
    );
};

export default Shipped;
