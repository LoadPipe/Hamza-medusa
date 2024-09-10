import React, { useEffect, useState } from 'react';
import { getSingleBucket } from '@lib/data';
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
import RefundCard from '@modules/account/components/refund-card';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { formatCryptoPrice } from '@lib/util/get-product-price';

const Refund = ({ orders }: { orders: any[] }) => {
    const [customerOrder, setCustomerOrder] = useState<any[] | null>(null);
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [courierInfo, setCourierInfo] = useState(false);

    // console.log(`ORDERS ARE ${JSON.stringify(orders)}`);
    useEffect(() => {
        // console.log('Orders received in Cancelled:', orders);
        if (orders && orders.length > 0) {
            const customer_id = orders[0]?.customer_id;
            // console.log(
            //     `Running fetchAllOrders with customerID ${customer_id}`
            // );
            fetchAllOrders(customer_id);
            setCustomerId(customer_id);
        }
    }, [orders]);

    const toggleRefundInfo = (orderId: any) => {
        setCourierInfo(courierInfo === orderId ? null : orderId);
    };

    const getAmount = (
        amount?: number | null,
        currency_code?: string | null
    ) => {
        if (amount === null || amount === undefined) {
            return;
        }

        return formatCryptoPrice(amount, currency_code || 'USDC');
    };

    const fetchAllOrders = async (customerId: string) => {
        setIsLoading(true);
        try {
            const bucket = await getSingleBucket(customerId, 5);
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
            {customerOrder && customerOrder.length > 0 ? (
                <>
                    <h1>Refund Orders</h1>

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
                                        <RefundCard
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
                                                    toggleRefundInfo(item.id)
                                                }
                                            >
                                                Refund Details
                                            </Box>
                                        </div>
                                        <Collapse
                                            in={courierInfo === item.id}
                                            animateOpacity
                                        >
                                            <Box mt={4}>
                                                <Text
                                                    fontSize="24px"
                                                    fontWeight="semibold"
                                                >
                                                    {getAmount(
                                                        order.unit_price,
                                                        order.currency_code
                                                    )}{' '}
                                                    {order.currency_code}
                                                </Text>
                                                <HStack
                                                    align="start"
                                                    spacing={3}
                                                    w="100%"
                                                >
                                                    {' '}
                                                    {/* Align icon and text block horizontally */}
                                                    {/* Left Column: Icon */}
                                                    <Icon
                                                        as={BsCircleFill}
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
                                                            Your request is now
                                                            under review
                                                        </Text>
                                                        <Text
                                                            fontSize="sm"
                                                            color="gray.500"
                                                        >
                                                            Your request for a
                                                            refund is now under
                                                            review. We will
                                                            update you on the
                                                            status of your
                                                            request within 3-5
                                                            business days. Thank
                                                            you for your
                                                            patience.
                                                        </Text>
                                                    </VStack>
                                                </HStack>
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

export default Refund;
