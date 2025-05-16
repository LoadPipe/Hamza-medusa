import React, { useState } from 'react';
import {
    Box,
    Button,
    Collapse,
    Divider,
    Flex,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
} from '@chakra-ui/react';
import ShippedCard from '@modules/account/components/shipped-card';
import DynamicOrderStatus from '@modules/order/templates/dynamic-order-status';
import OrderTotalAmount from '@modules/order/templates/order-total-amount';
import { useOrderTabStore } from '@/zustand/order-tab-state';
import OrderTimeline from '@modules/order/components/order-timeline';
import { OrderNote } from '../all';
import { format as formatDate, parseISO } from 'date-fns';
import OrderDetails from '@modules/order/components/order-details';
import { calculateOrderTotals } from '@/lib/util/order-calculations';

const ShippedOrder = ({ order }: { order: any }) => {
    const [courierInfo, setCourierInfo] = useState(false);
    const [expandViewOrder, setExpandViewOrder] = useState(false);
    const orderActiveTab = useOrderTabStore((state) => state.orderActiveTab);

    const toggleCourierInfo = (orderId: any) => {
        setCourierInfo(courierInfo === orderId ? null : orderId);
    };

    const { subTotal, orderShippingTotal, orderDiscountTotal } =
        calculateOrderTotals(order);

    // Check if we Seller has left a `PUBLIC` note, we're only returning public notes to client.
    const hasSellerNotes = order?.notes?.length > 0;

    const chainId =
        order.payments[0]?.blockchain_data?.payment_chain_id ??
        order.payments[0]?.blockchain_data?.chain_id;

    return (
        <div key={order.id}>
            {order.items?.map(
                (
                    item: any,
                    index: number // Adjusting the map to the correct path
                ) => (
                    <div key={item.id}>
                        {index === 0 ? (
                            <DynamicOrderStatus
                                orderDate={formatDate(
                                    parseISO(order.created_at),
                                    'yyyy-MM-dd HH:mm:ss'
                                )}
                                paymentStatus={order.payment_status}
                                paymentType={'Shipped'}
                            />
                        ) : null}
                        <ShippedCard
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
                                        _hover={{
                                            textDecoration: 'underline',
                                        }}
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
                                            toggleCourierInfo(item.id)
                                        }
                                    >
                                        Track Courier
                                    </Button>
                                    {order.escrow_status &&
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
                        <Collapse
                            in={expandViewOrder === item.id}
                            animateOpacity
                        ></Collapse>
                        <Collapse in={courierInfo === item.id} animateOpacity>
                            <Box mt={4}>
                                <Tabs variant="unstyled">
                                    <TabList>
                                        <Tab
                                            _selected={{
                                                color: 'primary.green.900',
                                                borderBottom: '2px solid',
                                                borderColor:
                                                    'primary.green.900',
                                            }}
                                        >
                                            Order Details
                                        </Tab>

                                        <Tab
                                            _selected={{
                                                color: 'primary.green.900',
                                                borderBottom: '2px solid',
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
                                                    borderBottom: '2px solid',
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
                                            <OrderTimeline
                                                orderDetails={order}
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
                                    </TabPanels>
                                </Tabs>
                            </Box>
                        </Collapse>
                    </div>
                )
            )}
            <Divider
                width="90%" // Line takes up 80% of the screen width
                borderBottom="0.2px solid"
                mt={4}
                borderColor="#D9D9D9"
                pr={'1rem'}
                _last={{
                    // pb: 0,
                    // borderBottom: 'none',
                    mb: 8,
                }}
            />
        </div>
    );
};

export default ShippedOrder;
