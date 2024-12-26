import {
    Box,
    Divider,
    Text,
    Flex,
    Button,
    Collapse,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    VStack,
} from '@chakra-ui/react';
import Spinner from '@modules/common/icons/spinner';
import { addToCart } from '@modules/cart/actions';
import toast from 'react-hot-toast';
import DeliveredCard from '@modules/account/components/delivered-card';
import EmptyState from '@modules/order/components/empty-state';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DynamicOrderStatus from '@modules/order/templates/dynamic-order-status';
import OrderTotalAmount from '@modules/order/templates/order-total-amount';
import { OrdersData } from './all';
import { useOrderTabStore } from '@/zustand/order-tab-state';
import Link from 'next/link';
import OrderTimeline from '@modules/order/components/order-timeline';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { upperCase } from 'lodash';

const Delivered = ({
    customer,
    isEmpty,
}: {
    customer: string;
    isEmpty?: boolean;
}) => {
    const router = useRouter();
    let countryCode = useParams().countryCode as string;
    if (process.env.NEXT_PUBLIC_FORCE_COUNTRY)
        countryCode = process.env.NEXT_PUBLIC_FORCE_COUNTRY;

    const orderActiveTab = useOrderTabStore((state) => state.orderActiveTab);
    const queryClient = useQueryClient();
    const cachedData: OrdersData | undefined = queryClient.getQueryData([
        'batchOrders',
    ]);
    const deliveredOrder = cachedData?.Delivered || [];
    const [expandViewOrder, setExpandViewOrder] = useState(false);

    const toggleViewOrder = (orderId: any) => {
        setExpandViewOrder(expandViewOrder === orderId ? null : orderId);
    };

    //TODO: Refactor to a mutation
    const handleReorder = async (item: any, country_code: string) => {
        try {
            // console.log(item.variant_id, item.quantity, country_code);
            await addToCart({
                variantId: item.variant_id,
                countryCode: country_code,
                quantity: item.quantity,
            });
        } catch (e) {
            toast.error(`Product with name ${item.title} could not be added`);
        }

        router.push('/checkout');
    };

    // manually trigger a refetch if its stale
    // useEffect(() => {
    //     const retryFetch = async () => {
    //         if (isStale && deliveredOrder == undefined) {
    //             for (let i = 0; i < 3; i++) {
    //                 if (deliveredOrder == undefined) {
    //                     queryClient.resetQueries(['fetchDeliveredOrder']);
    //                     queryClient.invalidateQueries(['fetchDeliveredOrder']);
    //                     await new Promise((resolve) =>
    //                         setTimeout(resolve, 100)
    //                     );
    //                 }
    //             }
    //         }
    //     };
    //     retryFetch();
    // }, [isStale]);

    if (isEmpty && deliveredOrder && deliveredOrder?.length == 0) {
        return <EmptyState />;
    }

    return (
        <div style={{ width: '100%' }}>
            {deliveredOrder && deliveredOrder.length > 0 ? (
                <Flex width={'100%'} flexDirection="column">
                    {deliveredOrder.map((order: any) => {
                        const totalPrice = order.items.reduce(
                            (acc: number, item: any) =>
                                acc + item.unit_price * item.quantity,
                            0
                        );
                        return (
                            <Flex
                                key={order.id}
                                direction="column"
                                width="100%"
                            >
                                {order.items?.map(
                                    (item: any, index: number) => (
                                        <div key={item.id}>
                                            {index === 0 ? (
                                                <DynamicOrderStatus
                                                    paymentStatus={
                                                        order.payment_status
                                                    }
                                                    paymentType={'Delivered'}
                                                />
                                            ) : null}
                                            <DeliveredCard
                                                key={item.id}
                                                order={item}
                                                storeName={order.store.name}
                                                icon={order.store.icon}
                                                handle={
                                                    item.variant?.product
                                                        ?.handle || 'N/A'
                                                }
                                            />
                                            <Flex
                                                direction={{
                                                    base: 'column',
                                                    md: 'row',
                                                }}
                                                justifyContent={{
                                                    base: 'flex-start',
                                                    md: 'space-between',
                                                }}
                                                alignItems={{
                                                    base: 'flex-start',
                                                    md: 'center',
                                                }}
                                                mb={5}
                                            >
                                                <OrderTotalAmount
                                                    totalPrice={totalPrice}
                                                    currencyCode={
                                                        item.currency_code
                                                    }
                                                    index={index}
                                                    itemCount={
                                                        order.items.length - 1
                                                    }
                                                />
                                                <Flex
                                                    direction={{
                                                        base: 'column',
                                                        md: 'row',
                                                    }}
                                                    justifyContent={'flex-end'}
                                                    mt={{ base: 4, md: 0 }}
                                                    width="100%"
                                                >
                                                    {index ===
                                                    order.items.length - 1 ? (
                                                        <Button
                                                            variant="outline"
                                                            colorScheme="white"
                                                            borderRadius="37px"
                                                            cursor="pointer"
                                                            ml={{
                                                                base: 0,
                                                                md: 2,
                                                            }}
                                                            mt={{
                                                                base: 2,
                                                                md: 0,
                                                            }}
                                                            width={{
                                                                base: '100%',
                                                                md: 'auto',
                                                            }}
                                                            _hover={{
                                                                textDecoration:
                                                                    'underline',
                                                            }}
                                                            onClick={() =>
                                                                toggleViewOrder(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            View Order
                                                        </Button>
                                                    ) : null}

                                                    <Button
                                                        variant="outline"
                                                        colorScheme="white"
                                                        borderRadius={'37px'}
                                                        ml={{
                                                            base: 0,
                                                            md: 2,
                                                        }}
                                                        mt={{
                                                            base: 2,
                                                            md: 0,
                                                        }}
                                                        width={{
                                                            base: '100%',
                                                            md: 'auto',
                                                        }}
                                                        onClick={() =>
                                                            handleReorder(
                                                                item,
                                                                order
                                                                    .shipping_address
                                                                    .country_code
                                                            )
                                                        }
                                                    >
                                                        Buy Again
                                                    </Button>
                                                    <Link
                                                        href="https://support.hamza.market/help/1568263160"
                                                        target="_blank"
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            colorScheme="white"
                                                            borderRadius={
                                                                '37px'
                                                            }
                                                            ml={{
                                                                base: 0,
                                                                md: 2,
                                                            }}
                                                            mt={{
                                                                base: 2,
                                                                md: 0,
                                                            }}
                                                            width={{
                                                                base: '100%',
                                                                md: 'auto',
                                                            }}
                                                        >
                                                            Return/Refund
                                                        </Button>
                                                    </Link>
                                                </Flex>
                                            </Flex>
                                            <Collapse
                                                in={expandViewOrder === item.id}
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
                                                                Order Timeline
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
                                                            <TabPanel>
                                                                <OrderTimeline
                                                                    orderDetails={
                                                                        order
                                                                    }
                                                                />
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
                                                                        spacing={
                                                                            2
                                                                        }
                                                                    >
                                                                        {order
                                                                            ?.shipping_methods[0]
                                                                            ?.price && (
                                                                            <Text fontSize="md">
                                                                                <strong>
                                                                                    Order
                                                                                    Shipping
                                                                                    Cost:
                                                                                </strong>{' '}
                                                                                {formatCryptoPrice(
                                                                                    Number(
                                                                                        order
                                                                                            ?.shipping_methods[0]
                                                                                            ?.price
                                                                                    ),
                                                                                    item.currency_code ??
                                                                                        'usdc'
                                                                                )}{' '}
                                                                                {upperCase(
                                                                                    item.currency_code
                                                                                )}
                                                                            </Text>
                                                                        )}
                                                                    </VStack>
                                                                </VStack>
                                                            </TabPanel>
                                                        </TabPanels>
                                                    </Tabs>
                                                </Box>
                                            </Collapse>
                                        </div>
                                    )
                                )}

                                <Divider
                                    width="90%" // Line takes up 90% of the screen width
                                    borderBottom="0.2px solid"
                                    borderColor="#D9D9D9"
                                    pr={'1rem'}
                                    _last={{
                                        mt: 8,
                                        mb: 8,
                                    }}
                                />
                            </Flex>
                        );
                    })}
                </Flex>
            ) : null}
        </div>
    );
};

export default Delivered;
