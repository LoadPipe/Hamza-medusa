import { Box, Divider, Text, Flex, Button } from '@chakra-ui/react';
import Spinner from '@modules/common/icons/spinner';
import { addToCart } from '@modules/cart/actions';
import toast from 'react-hot-toast';
import DeliveredCard from '@modules/account/components/delivered-card';
import EmptyState from '@modules/order/components/empty-state';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DynamicOrderStatus from '@modules/order/templates/dynamic-order-status';
import OrderTotalAmount from '@modules/order/templates/order-total-amount';
import { OrdersData } from './all';
import { useOrderTabStore } from '@/zustand/order-tab-state';
import Link from 'next/link';

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
    const { data, isLoading, isError, refetch, isStale } = useQuery<OrdersData>(
        ['batchOrders']
    );

    const deliveredOrder = cachedData?.Delivered || [];

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
    useEffect(() => {
        const retryFetch = async () => {
            if (isStale && deliveredOrder == undefined) {
                for (let i = 0; i < 3; i++) {
                    if (deliveredOrder == undefined) {
                        queryClient.resetQueries(['fetchDeliveredOrder']);
                        queryClient.invalidateQueries(['fetchDeliveredOrder']);
                        await new Promise((resolve) =>
                            setTimeout(resolve, 100)
                        );
                    }
                }
            }
        };
        retryFetch();
    }, [isStale]);

    if (isEmpty && deliveredOrder && deliveredOrder?.length == 0) {
        return <EmptyState />;
    }

    return (
        <div style={{ width: '100%' }}>
            {isLoading ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    textAlign="center"
                    py={5}
                >
                    <Text color="white" fontSize="lg" mb={8}>
                        Loading Delivered orders...
                    </Text>
                    <Spinner size={80} />
                </Box>
            ) : isError && orderActiveTab !== 'All Orders' ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    textAlign="center"
                    py={5}
                >
                    <Text color="red.500" fontSize="lg" mb={8}>
                        Error fetching delivered orders.
                    </Text>
                </Box>
            ) : deliveredOrder && deliveredOrder.length > 0 ? (
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
                                        </div>
                                    )
                                )}

                                <Divider
                                    width="90%" // Line takes up 90% of the screen width
                                    borderBottom="0.2px solid"
                                    borderColor="#D9D9D9"
                                    pr={'1rem'}
                                    _last={{
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
