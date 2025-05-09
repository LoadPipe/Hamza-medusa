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
import { addToCart } from '@modules/cart/actions';
import toast from 'react-hot-toast';
import DeliveredCard from '@modules/account/components/delivered-card';
import EmptyState from '@modules/order/components/empty-state';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DynamicOrderStatus from '@modules/order/templates/dynamic-order-status';
import OrderTotalAmount from '@modules/order/templates/order-total-amount';
import { OrdersData } from './all';
import { useOrderTabStore } from '@/zustand/order-tab-state';
import Link from 'next/link';
import OrderTimeline from '@modules/order/components/order-timeline';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { upperCase } from 'lodash';
import {
    chainIdToName,
    getChainLogo,
} from '@modules/order/components/chain-enum/chain-enum';
import Image from 'next/image';
import { OrderNote } from './all';
import { format as formatDate, parseISO } from 'date-fns';
import OrderDetails from '@modules/order/components/order-details';
import { calculateOrderTotals } from '@/lib/util/order-calculations';

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
                        const {
                            subTotal,
                            orderShippingTotal,
                            orderSubTotal,
                            orderTotalPaid,
                            orderDiscountTotal,
                        } = calculateOrderTotals(order);

                        // Check if we Seller has left a `PUBLIC` note, we're only returning public notes to client.
                        const hasSellerNotes = order?.notes?.length > 0;
                        const chainId =
                            order?.payments[0]?.blockchain_data
                                ?.payment_chain_id ??
                            order?.payments[0]?.blockchain_data?.chain_id;

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
                                                    orderDate={formatDate(
                                                        parseISO(
                                                            order.created_at
                                                        ),
                                                        'yyyy-MM-dd HH:mm:ss'
                                                    )}
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
                                                    subTotal={subTotal}
                                                    currencyCode={
                                                        item.currency_code
                                                    }
                                                    index={index}
                                                    itemCount={
                                                        order.items.length - 1
                                                    }
                                                    paymentTotal={
                                                        order.payments[0]
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
                                                    {order.escrow_status &&
                                                        order.escrow_status !==
                                                            'released' && (
                                                            <Box
                                                                as="a"
                                                                href={`/account/escrow/${order.id}`}
                                                                border="1px solid"
                                                                borderColor="white"
                                                                borderRadius="37px"
                                                                color="white"
                                                                px="4"
                                                                py="2"
                                                                textAlign="center"
                                                                _hover={{
                                                                    textDecoration:
                                                                        'none',
                                                                    bg: 'primary.teal.600', // Adjust the hover color as needed
                                                                }}
                                                            >
                                                                View Escrow
                                                                Details
                                                            </Box>
                                                        )}
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
                                                                Order Details
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
                                                                Order Timeline
                                                            </Tab>
                                                            {hasSellerNotes && (
                                                                <Tab
                                                                    _selected={{
                                                                        color: 'primary.green.900',
                                                                        borderBottom:
                                                                            '2px solid',
                                                                        borderColor:
                                                                            'primary.green.900',
                                                                    }}
                                                                >
                                                                    Seller Note
                                                                </Tab>
                                                            )}
                                                        </TabList>
                                                        <TabPanels>
                                                            <TabPanel>
                                                                <OrderDetails
                                                                    order={
                                                                        order
                                                                    }
                                                                    subTotal={
                                                                        subTotal
                                                                    }
                                                                    orderDiscountTotal={
                                                                        orderDiscountTotal
                                                                    }
                                                                    orderShippingTotal={
                                                                        orderShippingTotal
                                                                    }
                                                                    chainId={
                                                                        chainId
                                                                    }
                                                                />
                                                            </TabPanel>
                                                            <TabPanel>
                                                                <OrderTimeline
                                                                    orderDetails={
                                                                        order
                                                                    }
                                                                />
                                                            </TabPanel>
                                                            {hasSellerNotes && (
                                                                <TabPanel>
                                                                    <Box
                                                                        mb={4}
                                                                        p={8}
                                                                        border="1px transparent"
                                                                        borderRadius="md"
                                                                        bg="black"
                                                                        boxShadow="sm"
                                                                        fontFamily="Inter, sans-serif"
                                                                    >
                                                                        {order.notes.map(
                                                                            (
                                                                                note: OrderNote,
                                                                                index: number
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        note.id
                                                                                    }
                                                                                >
                                                                                    {/* Date in smaller, gray text */}
                                                                                    <Text
                                                                                        color="gray.400"
                                                                                        fontSize="sm"
                                                                                        mb={
                                                                                            2
                                                                                        }
                                                                                    >
                                                                                        {formatDate(
                                                                                            new Date(
                                                                                                note.updated_at
                                                                                            ),
                                                                                            'EEEE, MMMM d, yyyy | h:mm a'
                                                                                        )}
                                                                                    </Text>

                                                                                    {/* The note content */}
                                                                                    <Text color="white">
                                                                                        {
                                                                                            note.note
                                                                                        }
                                                                                    </Text>

                                                                                    {/* Divider between notes (except after the last one) */}
                                                                                    {index <
                                                                                        order
                                                                                            .notes
                                                                                            .length -
                                                                                            1 && (
                                                                                        <Divider
                                                                                            my={
                                                                                                4
                                                                                            }
                                                                                            borderColor="#272727"
                                                                                        />
                                                                                    )}
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </Box>
                                                                </TabPanel>
                                                            )}
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
