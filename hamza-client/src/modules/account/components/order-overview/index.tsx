'use client';

import { useEffect, useMemo, useState } from 'react';
import { Order } from '@medusajs/medusa';
import OrderCard from '../order-card';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { addToCart } from '@modules/cart/actions';
import { useParams, useRouter } from 'next/navigation';
import Refund from '../../../order/templates/refund';
import Delivered from '../../../order/templates/delivered';
import Processing from '../../../order/templates/processing';
import Shipped from '../../../order/templates/shipped';
import All from '../../../order/templates/all';
import Cancelled from '../../../order/templates/cancelled';

import {
    getVendors,
    orderInformation,
    orderDetails,
    orderStatus,
    orderBucket,
    cancelOrder,
} from '@lib/data';
import {
    Button,
    ButtonGroup,
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
    Box,
    Flex,
} from '@chakra-ui/react';

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

const commonButtonStyles = {
    borderRadius: '8px',
    width: '146px',
    height: '56px',
    padding: '16px',
    bg: 'gray.900',
    borderColor: 'transparent',
    color: 'white',
    _hover: {
        // Assuming you want hover effects as well
        bg: 'gray.200',
        color: 'black',
    },
    _active: {
        bg: 'primary.green.900',
        color: 'black',
        transform: 'scale(0.98)',
        borderColor: '#bec3c9',
    },
};

enum OrderBucketType {
    TO_PAY = 1,
    TO_SHIP = 2,
    SHIPPED = 3,
    COMPLETED = 4,
    CANCELLED = 5,
    REFUNDED = 6,
}
const TABS = {
    ALL: 'All Orders',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    REFUND: 'Refund',
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
    const [customerOrder, setCustomerOrder] = useState<any[] | null>(null);
    const [isAttemptedSubmit, setIsAttemptedSubmit] = useState(false);
    const [customerId, setCustomerId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(TABS.ALL);

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

    const renderTabContent = () => {
        switch (activeTab) {
            case TABS.ALL:
                return <All />;
            case TABS.PROCESSING:
                return <Processing />;
            case TABS.SHIPPED:
                return <Shipped />;
            case TABS.DELIVERED:
                return <Delivered />;
            case TABS.CANCELLED:
                return <Cancelled />;
            case TABS.REFUND:
                return <Refund />;
            default:
                return <div>Select a tab to view orders.</div>;
        }
    };

    const fetchAllOrders = async (customerId: string) => {
        setIsLoading(true);
        try {
            const response = await orderDetails(customerId);
            // console.log(`Response is ${JSON.stringify(response)}`);
            // console.log(typeof response);
            // console.log(response);

            const bucket = await orderBucket(customerId);
            console.log(`Bucket is ${JSON.stringify(bucket)}`);

            if (response && Array.isArray(response)) {
                setCustomerOrder(response);
            } else {
                console.error('Expected an array but got:', response);
                setCustomerOrder([]); // Setting to empty array if the expected data is not found
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            setCustomerOrder([]); // Setting to empty array on error
        }
        setIsLoading(false);
    };

    useEffect(() => {
        let customer_id = orders[0].customer_id;
        console.log(
            `this is runnning and we getting customerID ${customer_id}`
        );
        if (orders && orders.length > 0) {
            fetchAllOrders(customer_id);
            setCustomerId(customer_id);
        }
    }, [orders]);

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
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
    return (
        <Box
            display="flex"
            flexDirection="column"
            gap="4"
            width="full"
            color="white"
            p="8"
        >
            <ButtonGroup isAttached justifyContent="center">
                {Object.values(TABS).map((tab) => (
                    <Button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        {...commonButtonStyles}
                        isActive={activeTab === tab}
                    >
                        {tab}
                    </Button>
                ))}
            </ButtonGroup>
            {renderTabContent()}
            {customerOrder && customerOrder.length > 0 ? (
                customerOrder.map((order) => (
                    <div
                        key={order.id} // Changed from cart_id to id since it's more reliable and unique
                        className="border-b border-gray-200 pb-6 last:pb-0 last:border-none"
                    >
                        {/*<div className="p-4 bg-gray-700">*/}
                        {/*    Cart ID {order.cart_id} - Total Items:{' '}*/}
                        {/*    {order.cart?.items?.length || 0}*/}
                        {/*    <span*/}
                        {/*        className="pl-2 text-blue-400 underline underline-offset-1 cursor-pointer"*/}
                        {/*        onClick={() =>*/}
                        {/*            handleReorder(order.cart?.items || [])*/}
                        {/*        }*/}
                        {/*    >*/}
                        {/*        Re-order*/}
                        {/*    </span>*/}
                        {/*</div>*/}
                        {order.cart?.items?.map(
                            (
                                item: any // Adjusting the map to the correct path
                            ) => (
                                <Box
                                    key={item.id}
                                    bg="rgba(39, 39, 39, 0.3)"
                                    p={4}
                                    m={2}
                                    rounded="lg"
                                >
                                    {/*item: {item.id} <br />*/}
                                    <OrderCard
                                        key={item.id}
                                        order={item}
                                        handle={
                                            item.variant?.product?.handle ||
                                            'N/A'
                                        }
                                    />
                                    <LocalizedClientLink
                                        href={`/account/orders/details/${order.id}`} // Ensure order_ids exists
                                        passHref
                                    >
                                        <Button
                                            variant="outline"
                                            colorScheme="white"
                                            borderRadius={'37px'}
                                        >
                                            See details
                                        </Button>
                                    </LocalizedClientLink>
                                    {orderStatuses[order.cart_id] ===
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
                                            variant="outline"
                                            colorScheme="white"
                                            borderRadius={'37px'}
                                            ml={4}
                                            onClick={() =>
                                                openModal(order.cart_id)
                                            }
                                        >
                                            Request Cancellation
                                        </Button>
                                    )}
                                </Box>
                            )
                        )}
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center w-full bg-black text-white p-8">
                    <h2>Nothing to see here</h2>
                    <p>You don't have any orders yet, let us change that :)</p>
                    <LocalizedClientLink href="/" passHref>
                        <Button>Continue shopping</Button>
                    </LocalizedClientLink>
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Request Cancellation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isInvalid={!cancelReason && isModalOpen}>
                            <Textarea
                                placeholder="Reason for cancellation"
                                value={cancelReason}
                                onChange={(e) =>
                                    setCancelReason(e.target.value)
                                }
                            />
                            {!cancelReason && isModalOpen && (
                                <FormErrorMessage>
                                    Cancellation reason is required.
                                </FormErrorMessage>
                            )}
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setIsModalOpen(false)}
                        >
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
        </Box>
    );
};

export default OrderOverview;
