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
import { LineItem } from '@medusajs/medusa';
import { retrieveOrder } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Order } from '@/web3/contracts/escrow';

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

    const subTotal = order.cart.items.reduce(
        (acc: number, item: LineItem) => acc + item.unit_price * item.quantity,
        0
    );

    return (
        <>
            {order && (
                <Flex key={order.id} direction="column" width="100%">
                    {order.cart.items?.map((item: any, index: number) => (
                        <div key={item.id}>
                            {index === 0 ? (
                                <DynamicOrderStatus
                                    paymentStatus={order.payment_status}
                                    paymentType={'Delivered'}
                                />
                            ) : null}
                            <DeliveredCard
                                key={item.id}
                                order={item}
                                storeName={order.store.name}
                                icon={order.store.icon}
                                handle={item.variant?.product?.handle || 'N/A'}
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
                                    currencyCode={item.currency_code}
                                    index={index}
                                    itemCount={order.cart.items.length - 1}
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
                                    {index === order.cart.items.length - 1 ? (
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
                                                Order Timeline
                                            </Tab>
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
                                        </TabList>
                                        <TabPanels>
                                            <TabPanel>
                                                {/* <OrderTimeline orderDetails={order} /> */}
                                                <div>Details</div>
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
                                                        <Text>
                                                            <strong>
                                                                Subtotal:{' '}
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
                                                </VStack>
                                            </TabPanel>
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
                </Flex>
            )}
        </>
    );
};
