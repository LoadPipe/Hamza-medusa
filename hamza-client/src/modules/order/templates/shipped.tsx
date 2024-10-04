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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Spinner from '@modules/common/icons/spinner';
import { debounce, upperCase } from 'lodash';
import { formatCryptoPrice } from '@lib/util/get-product-price';

const Shipped = ({
    customer,
    // chainEnabled,
    // onSuccess,
    isEmpty,
}: {
    customer: string;
    // chainEnabled?: boolean;
    // onSuccess?: () => void;
    isEmpty?: boolean;
}) => {
    const [courierInfo, setCourierInfo] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);

    // const debouncedOnSuccess = debounce(() => {
    //     onSuccess && onSuccess();
    // }, 1000);

    const toggleCourierInfo = (orderId: any) => {
        setCourierInfo(courierInfo === orderId ? null : orderId);
    };

    const queryClient = useQueryClient();

    const {
        data: shippedOrder,
        isLoading,
        isError,
        isFetching,
        failureCount,
        isStale,
    } = useQuery(
        ['fetchShippedOrder', customer],
        () => getSingleBucket(customer, 2), // Fetching shipped orders (bucket 2)
        {
            enabled: !!customer,
            retry: true,
            refetchOnWindowFocus: true,
        }
    );

    // manually trigger a refetch if its stale
    useEffect(() => {
        const retryFetch = async () => {
            if (isStale && shippedOrder == undefined) {
                for (let i = 0; i < 5; i++) {
                    if (shippedOrder == undefined) {
                        queryClient.resetQueries(['fetchShippedOrder']);
                        queryClient.invalidateQueries(['fetchShippedOrder']);
                        await new Promise((resolve) =>
                            setTimeout(resolve, 100)
                        );
                    }
                }
            }
        };
        retryFetch();
    }, [isStale]);

    // useEffect(() => {
    //     if (isSuccess && shippedOrder) {
    //         console.log(`TRIGGER`);
    //         debouncedOnSuccess();
    //     }
    // }, [isSuccess, chainEnabled]);

    console.log({
        template: 'SHIPPED',
        isLoading,
        isError,
        isFetching,
        failureCount,
        shippedOrder,
        isStale,
    });

    if (isLoading) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                py={5}
            >
                <Text color="white" fontSize="lg" mb={8}>
                    Loading Shipped orders...
                </Text>
                <Spinner size={80} />
            </Box>
        );
    }

    if (isError || !shippedOrder) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                py={5}
            >
                <Text color="red.500" fontSize="lg" mb={8}>
                    Error fetching shipped orders.
                </Text>
            </Box>
        );
    }

    if (isEmpty && shippedOrder?.length === 0) {
        return <EmptyState />;
    }

    return (
        <div>
            {/* Processing-specific content */}
            {shippedOrder && shippedOrder.length > 0 ? (
                <>
                    <h1>Shipped Orders</h1>

                    {shippedOrder.map((order: any) => (
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
                                            vendorName={order.store.name}
                                            address={order.shipping_address}
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
                                                                        {formatCryptoPrice(
                                                                            Number(
                                                                                item.unit_price
                                                                            ),
                                                                            item.currency_code ??
                                                                                'usdc'
                                                                        )}{' '}
                                                                        {upperCase(
                                                                            item.currency_code
                                                                        )}
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
