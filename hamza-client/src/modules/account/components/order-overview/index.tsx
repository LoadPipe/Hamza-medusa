'use client';

import { useEffect, useMemo, useState } from 'react';
import { Order } from '@medusajs/medusa';
import { addToCart } from '@modules/cart/actions';
import { useParams, useRouter } from 'next/navigation';
import { TABS } from 'modules/order-tab-management';

import { orderDetails, cancelOrder } from '@lib/data';
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
import All from '@modules/order/templates/all';
import Processing from '@modules/order/templates/processing';
import Shipped from '@modules/order/templates/shipped';
import Delivered from '@modules/order/templates/delivered';
import Cancelled from '@modules/order/templates/cancelled';
import Refund from '@modules/order/templates/refund';
import { useOrderTabStore } from '@store/order-tab-state';
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
    const orderActiveTab = useOrderTabStore((state) => state.orderActiveTab);

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

    const fetchAllOrders = async (customerId: string) => {
        setIsLoading(true);
        try {
            const response = await orderDetails(customerId);
            // const bucket = await orderBucket(customerId);
            // console.log(`Bucket is ${JSON.stringify(bucket)}`);

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
        if (orders.length === 0) return;
        let customer_id = orders[0].customer_id;
        console.log(
            `this is runnning and we getting customerID ${customer_id}`
        );
        if (orders && orders.length > 0) {
            fetchAllOrders(customer_id);
            setCustomerId(customer_id);
        }
    }, [orders]);
    const setOrderActiveTab = useOrderTabStore(
        (state) => state.setOrderActiveTab
    );

    const handleTabChange = (tab: string) => {
        if (orderActiveTab !== tab) {
            setOrderActiveTab(tab);
        }
    };

    const renderTabContent = () => {
        switch (orderActiveTab) {
            case TABS.PROCESSING:
                return <Processing orders={orders} />;
            case TABS.SHIPPED:
                return <Shipped orders={orders} />;
            case TABS.DELIVERED:
                return <Delivered orders={orders} />;
            case TABS.CANCELLED:
                return <Cancelled orders={orders} />;
            case TABS.REFUND:
                return <Refund orders={orders} />;
            default:
                return <All orders={orders} />;
        }
    };

    const handleCancel = async () => {
        if (!cancelReason) {
            setIsAttemptedSubmit(true);
            return;
        }
        if (!selectedOrderId) return;

        try {
            const response = await cancelOrder(selectedOrderId);
            console.log(
                `selectedOrder cancelOrder?? ${JSON.stringify(response)}`
            );
            setOrderStatuses((prevStatuses) => ({
                ...prevStatuses,
                [selectedOrderId]: 'canceled',
            }));
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error cancelling order: ', error);
        }
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
                        isActive={orderActiveTab === tab}
                    >
                        {tab}
                    </Button>
                ))}
            </ButtonGroup>
            {renderTabContent()}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Request Cancellations</ModalHeader>
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
