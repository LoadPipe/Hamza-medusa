import React, { useState } from 'react';
import { cancelOrder } from '@lib/data';
import { Box, Button, Text } from '@chakra-ui/react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import CancelOrderModal from '../components/cancel-order-modal';
import Processing from '@modules/order/templates/processing';
import Shipped from '@modules/order/templates/shipped';
import Delivered from '@modules/order/templates/delivered';
import Cancelled from '@modules/order/templates/cancelled';
import Refund from '@modules/order/templates/refund';
type OrderType = {
    id: string;
    cart: any;
    cart_id: string;
    status: string;
    // include other order properties here
};

interface OrderState {
    Processing: OrderType[];
    Shipped: OrderType[];
    Delivered: OrderType[];
    Cancelled: OrderType[];
    Refunded: OrderType[];
}

const MIN_CANCEL_REASON_LENGTH = 30;

const All = ({ orders }: { orders: any[] }) => {
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [isAttemptedSubmit, setIsAttemptedSubmit] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);

    const [customerOrder, setCustomerOrder] = useState<OrderState | null>({
        Processing: [],
        Shipped: [],
        Delivered: [],
        Cancelled: [],
        Refunded: [],
    });

    const closeCancelModal = () => {
        setIsModalOpen(false);
        setCancelReason('');
        setIsAttemptedSubmit(false);
    };

    const handleCancel = async () => {
        if ((cancelReason?.length ?? 0) < MIN_CANCEL_REASON_LENGTH) {
            setIsAttemptedSubmit(true);
            return;
        }
        if (!selectedOrderId) return;

        setIsCanceling(true); //start loader for button in modal

        try {
            await cancelOrder(selectedOrderId);
        } catch (error) {
            console.error('Error cancelling order: ', error);
        } finally {
            setIsCanceling(false);
            closeCancelModal();
        }
    };
    const areAllOrdersEmpty = customerOrder
        ? Object.values(customerOrder).every(
              (orderArray) => orderArray.length === 0
          )
        : true; // if customerOrder is null or undefined, consider all orders empty

    return (
        <Box>
            {!areAllOrdersEmpty ? (
                <Box>
                    <Box mt={4} mb={2}>
                        <Processing orders={orders} />
                    </Box>
                    <Box mt={4} mb={2}>
                        <Shipped orders={orders} />
                    </Box>
                    <Box mt={4} mb={2}>
                        <Delivered orders={orders} />
                    </Box>
                    <Box mt={4} mb={2}>
                        <Cancelled orders={orders} />
                    </Box>
                    <Box mt={4} mb={2}>
                        <Refund orders={orders} />
                    </Box>
                </Box>
            ) : (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    width="full"
                    bg="rgba(39, 39, 39, 0.3)"
                    color="white"
                    p={8}
                >
                    <Text fontSize="xl" fontWeight="bold">
                        Nothing to see here
                    </Text>
                    <Text>
                        You don't have any orders yet, let us change that :)
                    </Text>
                    <LocalizedClientLink href="/" passHref>
                        <Button m={8} colorScheme="whiteAlpha">
                            Continue shopping
                        </Button>
                    </LocalizedClientLink>
                </Box>
            )}

            <CancelOrderModal
                isModalOpen={isModalOpen}
                closeCancelModal={closeCancelModal}
                handleCancel={handleCancel}
                cancelReason={cancelReason}
                setCancelReason={setCancelReason}
                isAttemptedSubmit={isAttemptedSubmit}
                isCanceling={isCanceling}
            />
        </Box>
    );
};

export default All;
