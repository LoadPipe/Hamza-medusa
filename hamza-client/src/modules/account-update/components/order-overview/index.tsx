'use client';

import { useEffect, useState } from 'react';
import { Order } from '@medusajs/medusa';
import OrderCard from '../order-card';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { addToCart } from '@modules/cart/actions';
import { useParams, useRouter } from 'next/navigation';
import {
    getStores,
    getOrderInformation,
    getOrderDetails,
    getOrderStatus,
    cancelOrder,
} from '@lib/data';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Textarea,
    FormControl,
    FormErrorMessage,
} from '@chakra-ui/react';

const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

// Define a type that extends the Order type with any additional data
interface DetailedOrder extends Order {
    details?: any; // Further specify if you have the structure of the details
}
type OrderDetails = {
    thumbnail: string;
    title: string;
    description: string;
};
type OrderProps = {
    id: string;
    display_id: string;
    created_at: string;
    details: OrderDetails;
    paid_total: number;
    currency_code: string;
    unit_price: number;
    thumbnail: string;
    title: string;
    description: string;
    region: {
        id: string;
        name: string;
    };
};

type WishlistProps = OrderProps & {
    item: any;
    order: any;
    id: string;
};

const OrderOverview = ({ orders }: { orders: Order[] }) => {
    // Initialize state with the correct type
    const [detailedOrders, setDetailedOrders] = useState<DetailedOrder[]>([]);
    const [orderStatuses, setOrderStatuses] = useState<{
        [key: string]: string;
    }>({});
    const [cancelReason, setCancelReason] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [customerOrder, setCustomerOrder] = useState<Order[] | null>(null);
    const [isAttemptedSubmit, setIsAttemptedSubmit] = useState(false);

    const openModal = (orderId: string) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setCancelReason('');
        setIsAttemptedSubmit(false);
    };
    // console.log('Orders: ', orders);

    let countryCode = useParams().countryCode as string;
    if (process.env.NEXT_PUBLIC_FORCE_US_COUNTRY) countryCode = 'us';

    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = (await getOrderInformation(
                    orders[0]?.customer_id
                )) as any;
                setDetailedOrders(data.order);
            } catch (error) {
                console.error('Error fetching orders: ', error);
            }
        };

        const fetchAll = async () => {
            try {
                const { data } = (await getOrderDetails(
                    orders[0]?.customer_id
                )) as any;
                // console.log(
                //     `fetching all data in new style ${JSON.stringify(data.order.orders)}`
                // );
                setCustomerOrder(data.order.orders);
            } catch (e) {
                console.error('Error fetching all data in new style: ', e);
            }
        };

        fetchAll();
        fetchOrders();
    }, [orders]);

    useEffect(() => {
        const fetchStatuses = async () => {
            if (!orders || orders.length === 0) return;

            const statuses = await Promise.allSettled(
                orders.map(async (order, index) => {
                    // console.log(`Fetching status for order ${order.id}`);
                    try {
                        const statusRes = await getOrderStatus(order.id);
                        return {
                            orderId: order.id,
                            status: statusRes.order,
                        };
                    } catch (error) {
                        console.error(
                            `Error fetching status for order ${order.id}:`,
                            error
                        );
                        return {
                            orderId: order.id,
                            status: 'unknown',
                        };
                    }
                })
            );

            const statusMap: { [key: string]: any } = {};
            statuses.forEach((result) => {
                if (result.status === 'fulfilled') {
                    const { orderId, status } = result.value;
                    statusMap[orderId] = status;
                } else {
                    console.error(
                        `Failed to fetch status for order: ${result.reason}`
                    );
                }
            });

            setOrderStatuses(statusMap);
            // console.log('Order statuses: ', statusMap);
        };

        if (Object.keys(detailedOrders).length > 0) {
            fetchStatuses();
        }
    }, [detailedOrders, orders]);

    const handleCancel = async () => {
        if (!cancelReason) {
            setIsAttemptedSubmit(true);
            return;
        }
        if (!selectedOrderId) return;

        try {
            await cancelOrder(selectedOrderId);
            setOrderStatuses((prevStatuses) => ({
                ...prevStatuses,
                [selectedOrderId]: 'canceled',
            }));
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error cancelling order: ', error);
        }
    };

    const handleReorder = async (items: any) => {
        // console.log('Reorder button clicked');
        items.map(async (item: any) => {
            try {
                await addToCart({
                    variantId: item.variant_id,
                    countryCode: countryCode,
                    currencyCode: item.currency_code,
                    quantity: item.quantity,
                });
            } catch (e) {
                alert(`Product with name ${item.title} could not be added`);
            }
        });

        router.push('/checkout');

        return;
    };

    // console.log('groupedByCartId: ', groupedByCartId);
    // customerOrder?.map((order: any) => {
    //     console.log('Customer Order: ', order);
    // });

    return (
        <div className="flex flex-col gap-y-8 w-full bg-black text-white p-8">
            {customerOrder && customerOrder.length > 0
                ? customerOrder.map((orderGroup) => (
                    <div
                        key={orderGroup.cart_id}
                        className="border-b border-gray-200 pb-6 last:pb-0 last:border-none"
                    >
                        <div className="p-4 bg-gray-700">
                            Cart ID {orderGroup.cart_id} - Total Items:{' '}
                            {orderGroup.items.length}
                            <span
                                className="pl-2 text-blue-400 underline underline-offset-1 cursor-pointer"
                                onClick={() => {
                                    handleReorder(orderGroup.items);
                                }}
                            >
                                Re-order
                            </span>
                        </div>
                        {orderGroup.items.map((item) => {
                            const handle =
                                item.variant?.product?.handle || 'N/A'; // Grab the handle from the product object
                            return (
                                <div key={item.id}>
                                    item: {item.id} <br /> Order_id list:{' '}
                                    {/*{item.order_ids} <br />*/}
                                    {/*item quantity: {item.quantity}*/}
                                    <OrderCard
                                        key={item.id}
                                        order={item}
                                        handle={handle} // Pass the handle here
                                    />
                                    <LocalizedClientLink
                                        href={`/account/orders/details/${item.order_ids[0]}`}
                                        passHref
                                    >
                                        <Button colorScheme="blue">
                                            See details
                                        </Button>
                                    </LocalizedClientLink>
                                    {orderStatuses[orderGroup.cart_id] ===
                                        'canceled' ? (
                                        <Button
                                            colorScheme="red"
                                            ml={4}
                                            isDisabled
                                        >
                                            Cancellation Requested
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="solid"
                                            colorScheme="blue"
                                            ml={4}
                                            onClick={() =>
                                                openModal(orderGroup.cart_id)
                                            }
                                        >
                                            Request Cancellation
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))
                : null}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Request Cancellation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl
                            isInvalid={!cancelReason && isAttemptedSubmit}
                        >
                            <Textarea
                                placeholder="Reason for cancellation"
                                value={cancelReason}
                                onChange={(e) =>
                                    setCancelReason(e.target.value)
                                }
                            />
                            {!cancelReason && isAttemptedSubmit && (
                                <FormErrorMessage>
                                    Cancellation reason is required.
                                </FormErrorMessage>
                            )}
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            ml={3}
                            onClick={handleCancel}
                        >
                            Submit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );

    return (
        <div className="w-full flex flex-col items-center gap-y-4 bg-black text-white p-8">
            <h2 className="text-large-semi">Nothing to see here</h2>
            <p className="text-base-regular">
                You don't have any orders yet, let us change that {':)'}
            </p>
            <div className="mt-4">
                <LocalizedClientLink href="/" passHref>
                    <Button>Continue shopping</Button>
                </LocalizedClientLink>
            </div>
        </div>
    );
};

export default OrderOverview;
