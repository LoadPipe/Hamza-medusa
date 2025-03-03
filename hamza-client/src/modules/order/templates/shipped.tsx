import React, {useEffect, useState} from 'react';
import {getSingleBucket} from '@/lib/server';
import {
    Box,
    Button,
    Collapse,
    Divider,
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
import {BsCircleFill} from 'react-icons/bs';
import ShippedCard from '@modules/account/components/shipped-card';
import EmptyState from '@modules/order/components/empty-state';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import Spinner from '@modules/common/icons/spinner';
import {debounce, upperCase} from 'lodash';
import {formatCryptoPrice} from '@lib/util/get-product-price';
import DynamicOrderStatus from '@modules/order/templates/dynamic-order-status';
import currencyIcons from '@/images/currencies/crypto-currencies';
import OrderTotalAmount from '@modules/order/templates/order-total-amount';
import {OrdersData} from './all';
import {useOrderTabStore} from '@/zustand/order-tab-state';
import OrderTimeline from '@modules/order/components/order-timeline';
import {
    chainIdToName,
    getChainLogo,
} from '@modules/order/components/chain-enum/chain-enum';
import Image from 'next/image';
import { OrderNote } from './all'


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
    const queryClient = useQueryClient();
    const cachedData: OrdersData | undefined = queryClient.getQueryData([
        'batchOrders',
    ]);
    const [expandViewOrder, setExpandViewOrder] = useState(false);
    const orderActiveTab = useOrderTabStore((state) => state.orderActiveTab);

    const toggleCourierInfo = (orderId: any) => {
        setCourierInfo(courierInfo === orderId ? null : orderId);
    };

    const shippedOrder = cachedData?.Shipped || [];

    if (isEmpty && shippedOrder?.length === 0) {
        return <EmptyState/>;
    }

    const toggleViewOrder = (orderId: any) => {
        setExpandViewOrder(expandViewOrder === orderId ? null : orderId);
    };

    return (
        <div>
            {/* Processing-specific content */}
            {shippedOrder && shippedOrder.length > 0 ? (
                <Flex width={'100%'} flexDirection="column">
                    {shippedOrder.map((order: any) => {
                        const subTotal = order.items.reduce(
                            (acc: number, item: any) =>
                                acc + item.unit_price * item.quantity,
                            0
                        );
                        // Check if we Seller has left a `PUBLIC` note, we're only returning public notes to client.
                        const hasSellerNotes = order?.notes?.length > 0
                        return (
                            <div
                                key={order.id} // Changed from cart_id to id since it's more reliable and unique
                            >
                                {order.items?.map(
                                    (
                                        item: any,
                                        index: number // Adjusting the map to the correct path
                                    ) => (
                                        <div key={item.id}>
                                            {index === 0 ? (
                                                <DynamicOrderStatus
                                                    paymentStatus={
                                                        order.payment_status
                                                    }
                                                    paymentType={'Shipped'}
                                                />
                                            ) : null}
                                            <ShippedCard
                                                key={item.id}
                                                order={item}
                                                storeName={order.store.name}
                                                icon={order.store.icon}
                                                address={order.shipping_address}
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

                                                {/* Right-aligned buttons */}
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
                                                            _hover={{
                                                                textDecoration:
                                                                    'underline',
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
                                                                toggleCourierInfo(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            Track Courier
                                                        </Button>
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
                                            ></Collapse>
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
                                                                <HStack
                                                                    align="start"
                                                                    spacing={3}
                                                                    w="100%"
                                                                >
                                                                    <VStack
                                                                        align="start"
                                                                        spacing={
                                                                            2
                                                                        }
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
                                                                                {/* Stack text vertically */}
                                                                                {order.tracking_number && (
                                                                                    <>
                                                                                        <Text><b>Tracking
                                                                                            Number:</b> {order.tracking_number}
                                                                                        </Text>
                                                                                    </>
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
                                                                                            .external_metadata
                                                                                            ?.tracking
                                                                                            ?.data
                                                                                            ?.soOrderInfo
                                                                                            ?.createTime
                                                                                            ? new Date(
                                                                                                order.external_metadata.tracking.data.soOrderInfo.createTime
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


                                                                            </VStack>

                                                                            {/* Right Column: Order ID & Chain Data */}
                                                                            <VStack
                                                                                align="start"
                                                                                spacing={
                                                                                    2
                                                                                }
                                                                            >
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
                                                                                    align="start"
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
                                                                </HStack>
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
                                                                    {order.notes.map((note: OrderNote) => (
                                                                        <Box
                                                                            key={note.id}
                                                                            p={8}
                                                                            mb={4}
                                                                            border="1px transparent"
                                                                            borderRadius="md"
                                                                            bg="black"
                                                                            boxShadow="sm"
                                                                            fontFamily="Inter, sans-serif"
                                                                        >
                                                                            <Text>{note.note}</Text>
                                                                        </Box>
                                                                    ))}
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
                    })}
                </Flex>
            ) : null}
        </div>
    );
};

export default Shipped;
