import React, { useEffect, useState } from 'react';
import { getSingleBucket } from '@lib/data';
import { Box, Collapse, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { BsCircleFill } from 'react-icons/bs';
import RefundCard from '@modules/account/components/refund-card';
import EmptyState from '@modules/order/components/empty-state';
import { formatCryptoPrice } from '@lib/util/get-product-price';

const Refund = ({
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

    // console.log(`ORDERS ARE ${JSON.stringify(orders)}`);
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
