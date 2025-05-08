'use client';
import { Box, Button, Divider, Flex, Link, Text } from '@chakra-ui/react';
import DynamicOrderStatus from '@/modules/order/templates/dynamic-order-status';
import OrderTotalAmount from '@/modules/order/templates/order-total-amount';
import DeliveredCard from '@modules/account/components/delivered-card';
import {
    Collapse,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    VStack,
} from '@chakra-ui/react';
import OrderTimeline from '../order-timeline';
import { formatCryptoPrice } from '@/lib/util/get-product-price';
import { upperCase } from 'lodash';
import { useState } from 'react';
import router from 'next/router';
import { toast } from 'react-hot-toast';
import { addToCart, enrichLineItems } from '@/modules/cart/actions';
import { LineItem, Store } from '@medusajs/medusa';
import { retrieveOrder } from '@/lib/server';
import { notFound } from 'next/navigation';
import { Order } from '@/web3/contracts/escrow';
import OrderDetails from '../order-details';
import { calculateOrderTotals } from '@/lib/util/order-calculations';

// Add type mapping for OrderDetails component
interface OrderDetailsOrder {
    id: string;
    tracking_number?: string;
    items: {
        id: string;
        currency_code: string;
        unit_price: number;
        quantity: number;
    }[];
    store: {
        handle: string;
        name: string;
        icon: string;
    };
    external_metadata?: {
        tracking?: {
            data?: {
                soOrderInfo?: {
                    createTime?: string;
                };
            };
        };
    };
}

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type ExtendedStore = Store & {
    handle?: string;
    icon?: string;
};

// Add type for DeliveredCard Order
interface DeliveredCardOrder {
    id: string;
    display_id: string;
    created_at: string;
    details: {
        thumbnail: string;
        title: string;
        description: string;
    };
    quantity: string;
    paid_total: number;
    currency_code: string;
    unit_price: number;
    thumbnail: string;
    title: string;
    description: string;
    variant: {
        product_id: string;
        metadata: {
            imgUrl?: string;
        };
    };
    region: {
        id: string;
        name: string;
    };
}

export const OrderComponent = ({ order }: { order: Order }) => {
    const [expandViewOrder, setExpandViewOrder] = useState(null);

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

    const { subTotal, orderShippingTotal, orderDiscountTotal } =
        calculateOrderTotals(order as any);

    // const subTotal = order.items.reduce(
    //     (acc: number, item: ExtendedLineItem) =>
    //         acc + item.unit_price * item.quantity,
    //     0
    // );

    // Calculate shipping total from shipping methods
    // const orderShippingTotal = order.shipping_methods?.[0]?.price || 0;
    // // For now, setting discount total to 0 as it's not available in the current order structure
    // const orderDiscountTotal = 0;
    // Get chainId from order metadata or default to a value
    const chainId =
        order.payments[0]?.blockchain_data?.payment_chain_id ??
        order.payments[0]?.blockchain_data?.chain_id;

    // Map the order to match OrderDetails expected format
    const mappedOrder: OrderDetailsOrder = {
        id: order.id,
        tracking_number: order.fulfillments?.[0]?.tracking_numbers?.[0],
        items: order.items.map((item) => ({
            id: item.id,
            currency_code: (item as ExtendedLineItem).currency_code || 'usdc',
            unit_price: item.unit_price,
            quantity: item.quantity,
        })),
        store: {
            handle: (order.store as ExtendedStore).handle || '',
            name: order.store.name,
            icon: (order.store as ExtendedStore).icon || '',
        },
        external_metadata: order.metadata as any,
    };

    // Map LineItem to DeliveredCard Order format
    const mapToDeliveredCardOrder = (
        item: ExtendedLineItem
    ): DeliveredCardOrder => ({
        id: item.id,
        display_id: order.display_id?.toString() || '',
        created_at: order.created_at?.toString() || new Date().toISOString(),
        details: {
            thumbnail: item.thumbnail || '',
            title: item.title || '',
            description: item.description || '',
        },
        quantity: item.quantity.toString(),
        paid_total: item.unit_price * item.quantity,
        currency_code: item.currency_code || 'usdc',
        unit_price: item.unit_price,
        thumbnail: item.thumbnail || '',
        title: item.title || '',
        description: item.description || '',
        variant: {
            product_id: item.variant_id || '',
            metadata: {
                imgUrl: item.thumbnail || undefined,
            },
        },
        region: {
            id: order.region?.id || '',
            name: order.region?.name || '',
        },
    });

    return (
        <>
            {order && (
                <Flex key={order.id} direction="column" width="100%">
                    {order.items?.map(
                        (item: ExtendedLineItem, index: number) => (
                            <div key={item.id}>
                                {index === 0 ? (
                                    <DynamicOrderStatus
                                        paymentStatus={order.payment_status}
                                        paymentType={'Delivered'}
                                    />
                                ) : null}
                                <DeliveredCard
                                    key={item.id}
                                    order={mapToDeliveredCardOrder(item)}
                                    storeName={order.store.name}
                                    icon={
                                        (order.store as ExtendedStore).icon ||
                                        ''
                                    }
                                    handle={
                                        item.variant?.product?.handle || 'N/A'
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
                                            item.currency_code || 'usdc'
                                        }
                                        index={index}
                                        itemCount={order.items.length - 1}
                                        paymentTotal={order.payments[0]}
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
                                        {index === order.items.length - 1 ? (
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
                                                onClick={() =>
                                                    toggleViewOrder(item.id)
                                                }
                                            >
                                                View Order
                                            </Button>
                                        ) : null}
                                    </Flex>
                                </Flex>
                                <Collapse
                                    in={expandViewOrder === item.id}
                                    animateOpacity
                                >
                                    <Box mt={4}>
                                        <Tabs
                                            variant="unstyled"
                                            defaultIndex={0}
                                        >
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
                                            </TabList>
                                            <TabPanels>
                                                <TabPanel>
                                                    <OrderDetails
                                                        order={mappedOrder}
                                                        subTotal={subTotal}
                                                        orderDiscountTotal={
                                                            orderDiscountTotal
                                                        }
                                                        orderShippingTotal={
                                                            orderShippingTotal
                                                        }
                                                        chainId={chainId.toString()}
                                                    />
                                                </TabPanel>
                                            </TabPanels>
                                        </Tabs>
                                    </Box>
                                </Collapse>
                            </div>
                        )
                    )}

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
            )}
        </>
    );
};
