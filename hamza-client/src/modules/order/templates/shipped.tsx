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
import { BsCircleFill } from 'react-icons/bs';
import ShippedCard from '@modules/account/components/shipped-card';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

const Shipped = ({ orders }: { orders: any[] }) => {
    const [customerOrder, setCustomerOrder] = useState<any[] | null>(null);
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [courierInfo, setCourierInfo] = useState(false);

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

    const toggleCourierInfo = (orderId: any) => {
        setCourierInfo(courierInfo === orderId ? null : orderId);
    };

    const fetchAllOrders = async (customerId: string) => {
        setIsLoading(true);
        try {
            const bucket = await singleBucket(customerId, 2);
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
            <h1>Shipped Orders</h1>
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
                                                                <Text fontWeight="bold">
                                                                    Your order
                                                                    is shipped
                                                                    out for
                                                                    delivery
                                                                </Text>
                                                                <Text
                                                                    color="gray.500"
                                                                    fontSize="16px"
                                                                >
                                                                    {new Date(
                                                                        order.created_at
                                                                    ).toLocaleDateString()}
                                                                </Text>
                                                                <Text
                                                                    fontSize="sm"
                                                                    color="gray.500"
                                                                >
                                                                    Tracking
                                                                    Number:
                                                                    5896-0991-7811
                                                                </Text>
                                                                <Text
                                                                    fontSize="sm"
                                                                    color="gray.500"
                                                                >
                                                                    Estimated
                                                                    Time: 2:00
                                                                    pm
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
                                                            <Text fontWeight="bold">
                                                                Item Details
                                                            </Text>
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

export default Shipped;
