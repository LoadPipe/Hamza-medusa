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
import CancelCard from '@modules/account/components/cancel-card';
import EmptyState from '@modules/order/components/empty-state';
import {useQueryClient} from '@tanstack/react-query';
import React, {useState} from 'react';
import DynamicOrderStatus from '@modules/order/templates/dynamic-order-status';
import OrderTotalAmount from '@modules/order/templates/order-total-amount';
import CancellationModal from '@modules/order/templates/cancelled-modal';
import {OrdersData} from './all';
import {useOrderTabStore} from '@/zustand/order-tab-state';
import OrderTimeline from '@modules/order/components/order-timeline';
import {formatCryptoPrice} from '@lib/util/get-product-price';
import {upperCase} from 'lodash';
import {
    chainIdToName,
    getChainLogo,
} from '@modules/order/components/chain-enum/chain-enum';
import Image from 'next/image';
import {OrderNote} from './all'
import { format } from 'date-fns';

const Cancelled = ({
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
    const [activeOrder, setActiveOrder] = useState<string | null>(null); // State to track the active order's modal
    const orderActiveTab = useOrderTabStore((state) => state.orderActiveTab);
    const [expandViewOrder, setExpandViewOrder] = useState(false);

    const queryClient = useQueryClient();
    const cachedData: OrdersData | undefined = queryClient.getQueryData([
        'batchOrders',
    ]);

    const toggleViewOrder = (orderId: any) => {
        setExpandViewOrder(expandViewOrder === orderId ? null : orderId);
    };

    // const {
    //     data,
    //     isLoading: cancelIsLoading,
    //     isError: cancelIsError,
    // } = useQuery<OrdersData>(['batchOrders']);

    const canceledOrder = cachedData?.Cancelled || [];
    if (isEmpty && canceledOrder && canceledOrder?.length == 0) {
        return <EmptyState/>;
    }

    return (
        <div style={{width: '100%'}}>
            {/*{cancelIsLoading ? (*/}
            {/*    <Box*/}
            {/*        display="flex"*/}
            {/*        flexDirection="column"*/}
            {/*        justifyContent="center"*/}
            {/*        alignItems="center"*/}
            {/*        textAlign="center"*/}
            {/*        py={5}*/}
            {/*    >*/}
            {/*        <Text color="white" fontSize="lg" mb={8}>*/}
            {/*            Loading Cancelled orders...*/}
            {/*        </Text>*/}
            {/*        <Spinner size={80} />*/}
            {/*    </Box>*/}
            {/*) : cancelIsError && orderActiveTab !== 'All Orders' ? (*/}
            {/*    <Box*/}
            {/*        display="flex"*/}
            {/*        flexDirection="column"*/}
            {/*        justifyContent="center"*/}
            {/*        alignItems="center"*/}
            {/*        textAlign="center"*/}
            {/*        py={5}*/}
            {/*    >*/}
            {/*        <Text color="red.500" fontSize="lg" mb={8}>*/}
            {/*            Error fetching delivered orders.*/}
            {/*        </Text>*/}
            {/*    </Box>*/}
            {/*) :*/}
            {canceledOrder && canceledOrder.length > 0 ? (
                <Flex width={'100%'} flexDirection="column">
                    {canceledOrder.map((order: any) => {
                        const subTotal = order.items.reduce(
                            (acc: number, item: any) =>
                                acc + item.unit_price * item.quantity,
                            0
                        );

                        // Check if we Seller has left a `PUBLIC` note, we're only returning public notes to client.
                        const hasSellerNotes = order?.notes?.length > 0

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
                                                    paymentType={'Cancelled'}
                                                />
                                            ) : null}
                                            <CancelCard
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
                                                    direction={'row'}
                                                    justifyContent={'flex-end'}
                                                >
                                                    <Text
                                                        fontSize="16px"
                                                        fontWeight="semibold"
                                                    >
                                                        {/*{getAmount(*/}
                                                        {/*    order.unit_price*/}
                                                        {/*)}{' '}*/}
                                                        {/*{upperCase(*/}
                                                        {/*    order.currency_code*/}
                                                        {/*)}*/}
                                                    </Text>
                                                </Flex>
                                                {index ===
                                                order.items.length - 1 ? (
                                                    <Flex
                                                        direction={{
                                                            base: 'column',
                                                            md: 'row',
                                                        }}
                                                        justifyContent={
                                                            'flex-end'
                                                        }
                                                        gap={2}
                                                        mt={{base: 4, md: 0}}
                                                        width="100%"
                                                    >
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
                                                        <Button
                                                            variant="outline"
                                                            colorScheme="white"
                                                            borderRadius={
                                                                '37px'
                                                            }
                                                            onClick={() =>
                                                                setActiveOrder(
                                                                    order.id
                                                                )
                                                            } // Set active order on click
                                                            width={{
                                                                base: '100%',
                                                                md: 'auto',
                                                            }}
                                                        >
                                                            View Cancellation
                                                            Details
                                                        </Button>
                                                        <a
                                                            href="https://blog.hamza.market/contact/"
                                                            target="_blank"
                                                        >
                                                            <Button
                                                                ml={{
                                                                    base: 0,
                                                                    md: 2,
                                                                }}
                                                                mt={{
                                                                    base: 2,
                                                                    md: 0,
                                                                }}
                                                                variant="outline"
                                                                colorScheme="white"
                                                                borderRadius={
                                                                    '37px'
                                                                }
                                                                width={{
                                                                    base: '100%',
                                                                    md: 'auto',
                                                                }}
                                                            >
                                                                Contact Seller
                                                            </Button>
                                                        </a>
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
                                                ) : null}
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

                                                            {hasSellerNotes &&
                                                                <Tab
                                                                    _selected={{
                                                                        color: 'primary.green.900',
                                                                        borderBottom:
                                                                            '2px solid',
                                                                        borderColor:
                                                                            'primary.green.900',
                                                                    }}
                                                                >Seller Note</Tab>}
                                                        </TabList>
                                                        <TabPanels>
                                                            <TabPanel>
                                                                <VStack
                                                                    align="start"
                                                                    spacing={4}
                                                                    p={4}
                                                                    borderRadius="lg"
                                                                    w="100%"
                                                                >
                                                                    <Flex
                                                                        direction={{
                                                                            base: 'column',
                                                                            md: 'row',
                                                                        }}
                                                                        gap={6}
                                                                        w="100%"
                                                                    >
                                                                        {/* Left Column: Shipping Cost & Subtotal */}
                                                                        <VStack
                                                                            align="start"
                                                                            spacing={
                                                                                2
                                                                            }
                                                                            flex="1"
                                                                        >
                                                                            {order.tracking_number && (
                                                                                <>
                                                                                    <Text><b>Tracking
                                                                                        Number:</b> {order.tracking_number}
                                                                                    </Text>
                                                                                </>
                                                                            )}
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
                                                                            <Text fontSize="md">
                                                                                <strong>
                                                                                    Subtotal:
                                                                                </strong>{' '}
                                                                                {formatCryptoPrice(
                                                                                    subTotal,
                                                                                    item.currency_code
                                                                                )}{' '}
                                                                                {upperCase(
                                                                                    item.currency_code
                                                                                )}
                                                                            </Text>
                                                                        </VStack>

                                                                        {/* Right Column: Order ID & Chain Data */}
                                                                        <VStack
                                                                            align="start"
                                                                            spacing={
                                                                                2
                                                                            }
                                                                            flex="1"
                                                                        >
                                                                            <Flex
                                                                                align="center"
                                                                                gap={
                                                                                    2
                                                                                }
                                                                            >
                                                                                <Text fontSize="md">
                                                                                    <strong>
                                                                                        Order
                                                                                        ID:
                                                                                    </strong>{' '}
                                                                                    {order?.id &&
                                                                                    typeof order.id ===
                                                                                    'string'
                                                                                        ? order.id.replace(
                                                                                            /^order_/,
                                                                                            ''
                                                                                        ) // Remove "order_" prefix
                                                                                        : 'Order ID not available'}
                                                                                </Text>
                                                                            </Flex>

                                                                            <Flex
                                                                                align="center"
                                                                                gap={
                                                                                    2
                                                                                }
                                                                            >
                                                                                <strong>
                                                                                    Order
                                                                                    Chain:
                                                                                </strong>
                                                                                <Image
                                                                                    src={getChainLogo(
                                                                                        order
                                                                                            ?.payments[0]
                                                                                            ?.blockchain_data
                                                                                            ?.chain_id
                                                                                    )}
                                                                                    alt={chainIdToName(
                                                                                        order
                                                                                            ?.payments[0]
                                                                                            ?.blockchain_data
                                                                                            ?.chain_id
                                                                                    )}
                                                                                    width={
                                                                                        25
                                                                                    }
                                                                                    height={
                                                                                        25
                                                                                    }
                                                                                />
                                                                                <Text>
                                                                                    {chainIdToName(
                                                                                        order
                                                                                            ?.payments[0]
                                                                                            ?.blockchain_data
                                                                                            ?.chain_id
                                                                                    )}
                                                                                </Text>
                                                                            </Flex>
                                                                        </VStack>
                                                                    </Flex>
                                                                </VStack>
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
                                                                        {order.notes.map((note: OrderNote, index: number) => (
                                                                            <div key={note.id}>
                                                                                {/* Date in smaller, gray text */}
                                                                                <Text color="gray.400" fontSize="sm" mb={2}>
                                                                                    {format(new Date(note.updated_at), 'EEEE, MMMM d, yyyy | h:mm a')}
                                                                                </Text>

                                                                                {/* The note content */}
                                                                                <Text color="white">{note.note}</Text>

                                                                                {/* Divider between notes (except after the last one) */}
                                                                                {index < order.notes.length - 1 && (
                                                                                    <Divider my={4} borderColor="#272727" />
                                                                                )}
                                                                            </div>
                                                                        ))}
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
                                <CancellationModal
                                    isOpen={activeOrder === order.id}
                                    onClose={() => setActiveOrder(null)}
                                    cancelReason={order.metadata?.cancel_reason}
                                    canceledAt={order.canceled_at}
                                />
                                <Divider
                                    width="90%"
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

export default Cancelled;
