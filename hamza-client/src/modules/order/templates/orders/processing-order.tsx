import React, { useState } from 'react';
import {
    Box,
    Button,
    Collapse,
    Flex,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Divider,
} from '@chakra-ui/react';
import { format as formatDate, parseISO } from 'date-fns';
import OrderTimeline from '@modules/order/components/order-timeline';
import ProcessingOrderCard from '@modules/account/components/processing-order-card';
import DynamicOrderStatus from '@modules/order/templates/dynamic-order-status';
import OrderTotalAmount from '@modules/order/templates/order-total-amount';
import OrderDetails from '@modules/order/components/order-details';
import { OrderNote, HistoryMeta, OrderHistory } from '../all';
import { calculateOrderTotals } from '@/lib/util/order-calculations';

const ProcessingOrder = ({ order }: { order: any }) => {
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [expandViewOrder, setExpandViewOrder] = useState(false);

    const openModal = (orderId: string) => {
        setSelectedOrderId(orderId);
        setCancelReason(''); // Ensure cancel reason is cleared here
        setIsModalOpen(true);
    };

    const toggleViewOrder = (orderId: any) => {
        setExpandViewOrder(expandViewOrder === orderId ? null : orderId);
    };

    const { subTotal, orderShippingTotal, orderDiscountTotal } =
        calculateOrderTotals(order);

    // Check if we Seller has left a `PUBLIC` note, we're only returning public notes to client.
    const hasSellerNotes = order?.notes?.length > 0;

    // Locate the history that contains a non-empty transaction array
    const historyWithTransaction = order?.history?.find(
        (history: OrderHistory) =>
            Array.isArray(history.metadata?.transaction) &&
            history.metadata.transaction.length > 0
    );

    // Then extract the transactions array if it exists
    const transactions = historyWithTransaction?.metadata?.transaction;

    const chainId =
        order.payments[0]?.blockchain_data?.payment_chain_id ??
        order.payments[0]?.blockchain_data?.chain_id;

    return (
        <div key={order.id}>
            {order.items?.map((item: any, index: number) => (
                <div key={item.id}>
                    {index === 0 ? (
                        <DynamicOrderStatus
                            orderDate={formatDate(
                                parseISO(order.created_at),
                                'yyyy-MM-dd HH:mm:ss'
                            )}
                            paymentStatus={order.payment_status}
                            paymentType={'Processing'}
                            cartId={order.cart_id}
                        />
                    ) : null}
                    {/*item: {item.id} <br />*/}
                    <ProcessingOrderCard
                        key={item.id}
                        order={item}
                        storeName={order.store.name}
                        icon={order.store.icon}
                        address={order.shipping_address}
                        handle={item.variant?.product?.handle || 'N/A'}
                    />
                    <Flex
                        direction={{
                            base: 'column',
                            md: 'row',
                        }}
                        justifyContent={{
                            base: 'flex-start',
                            md: 'center',
                        }}
                        alignItems={{
                            base: 'flex-start',
                            md: 'center',
                        }}
                        mb={5}
                    >
                        {/* Left-aligned text */}
                        <OrderTotalAmount
                            subTotal={subTotal}
                            currencyCode={item.currency_code}
                            index={index}
                            itemCount={order.items.length - 1}
                            paymentTotal={order.payments[0]}
                        />

                        {/* Right-aligned buttons */}
                        {index === order.items.length - 1 ? (
                            <Flex
                                direction={{
                                    base: 'column',
                                    md: 'row',
                                }}
                                justifyContent={'flex-end'}
                                gap={2}
                                mt={{ base: 4, md: 0 }}
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
                                        textDecoration: 'underline',
                                    }}
                                    onClick={() => toggleViewOrder(item.id)}
                                >
                                    View Order
                                </Button>

                                <Button
                                    variant="outline"
                                    colorScheme="white"
                                    borderRadius="37px"
                                    onClick={() => openModal(order.id)}
                                >
                                    Request Cancellation
                                </Button>
                                {order.escrow_status !== 'buyer_released' &&
                                    order.escrow_status !== 'released' && (
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
                                                textDecoration: 'none',
                                                bg: 'primary.teal.600', // Adjust the hover color as needed
                                            }}
                                        >
                                            View Escrow Details
                                        </Box>
                                    )}
                            </Flex>
                        ) : null}
                    </Flex>

                    {/* Collapsible Section */}
                    <Collapse in={expandViewOrder === item.id} animateOpacity>
                        <Box mt={4}>
                            <Tabs variant="unstyled">
                                <TabList>
                                    <Tab
                                        _selected={{
                                            color: 'primary.green.900',
                                            borderBottom: '2px solid',
                                            borderColor: 'primary.green.900',
                                        }}
                                    >
                                        Order Details
                                    </Tab>
                                    <Tab
                                        _selected={{
                                            color: 'primary.green.900',
                                            borderBottom: '2px solid',
                                            borderColor: 'primary.green.900',
                                        }}
                                    >
                                        Order Timeline
                                    </Tab>
                                    {hasSellerNotes && (
                                        <Tab
                                            _selected={{
                                                color: 'primary.green.900',
                                                borderBottom: '2px solid',
                                                borderColor:
                                                    'primary.green.900',
                                            }}
                                        >
                                            Seller Note
                                        </Tab>
                                    )}

                                    {transactions && (
                                        <Tab
                                            _selected={{
                                                color: 'primary.green.900',
                                                borderBottom: '2px solid',
                                                borderColor:
                                                    'primary.green.900',
                                            }}
                                        >
                                            Transaction History
                                        </Tab>
                                    )}
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <OrderDetails
                                            order={order}
                                            subTotal={subTotal}
                                            orderDiscountTotal={
                                                orderDiscountTotal
                                            }
                                            orderShippingTotal={
                                                orderShippingTotal
                                            }
                                            chainId={chainId}
                                        />
                                    </TabPanel>
                                    <TabPanel>
                                        {(() => {
                                            console.log(
                                                'Order data passed to OrderTimeline:',
                                                {
                                                    created_at:
                                                        order.created_at,
                                                    updated_at:
                                                        order.updated_at,
                                                    status: order.status,
                                                    fulfillment_status:
                                                        order.fulfillment_status,
                                                    payment_status:
                                                        order.payment_status,
                                                    history: order.history,
                                                    refunds: order.refunds,
                                                }
                                            );
                                            return (
                                                <OrderTimeline
                                                    orderDetails={order}
                                                />
                                            );
                                        })()}
                                    </TabPanel>
                                    {/* The note container */}
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
                                                        <div key={note.id}>
                                                            {/* Date in smaller, gray text */}
                                                            <Text
                                                                color="gray.400"
                                                                fontSize="sm"
                                                                mb={2}
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
                                                                {note.note}
                                                            </Text>

                                                            {/* Divider between notes (except after the last one) */}
                                                            {index <
                                                                order.notes
                                                                    .length -
                                                                    1 && (
                                                                <Divider
                                                                    my={4}
                                                                    borderColor="#272727"
                                                                />
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </Box>
                                        </TabPanel>
                                    )}

                                    {transactions && (
                                        <TabPanel>
                                            <Box
                                                p={8}
                                                mb={4}
                                                border="1px transparent"
                                                borderRadius="md"
                                                bg="black"
                                                boxShadow="sm"
                                                fontFamily="Inter, sans-serif"
                                            >
                                                {transactions.map(
                                                    (
                                                        tx: HistoryMeta,
                                                        index: number
                                                    ) => (
                                                        <div
                                                            key={
                                                                tx.transaction_id
                                                            }
                                                        >
                                                            <Text
                                                                color="gray.400"
                                                                fontSize="sm"
                                                                mb={2}
                                                            >
                                                                {formatDate(
                                                                    new Date(
                                                                        tx?.date
                                                                    ),
                                                                    'EEEE, MMMM d, yyyy | h:mm a'
                                                                )}
                                                            </Text>
                                                            <Text>
                                                                Transaction ID:{' '}
                                                                {
                                                                    tx?.transaction_id
                                                                }
                                                            </Text>
                                                            <Text>
                                                                Transaction
                                                                Type: {tx?.type}
                                                            </Text>

                                                            {index <
                                                                transactions.length -
                                                                    1 && (
                                                                <Divider
                                                                    my={4}
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
            ))}

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
        </div>
    );
};

export default ProcessingOrder;
