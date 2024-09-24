import React, { useEffect, useState } from 'react';
import { getOrderBucket } from '@lib/data';
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

const All = ({ customer }: { customer: string }) => {
    const [customerId, setCustomerId] = useState<string | null>(null);

    const [customerOrder, setCustomerOrder] = useState<OrderState | null>({
        Processing: [],
        Shipped: [],
        Delivered: [],
        Cancelled: [],
        Refunded: [],
    });

    useEffect(() => {
        // console.log('Orders received in Cancelled:', orders);
        if (customer && customer.length > 0) {
            const customer_id = customer;
            // console.log(
            //     `Running fetchAllOrders with customerID ${customer_id}`
            // );
            fetchAllOrders(customer_id);
            setCustomerId(customer_id);
        }
    }, [customer]);

    const fetchAllOrders = async (customerId: string) => {
        try {
            const response = await getOrderBucket(customerId);
            console.log(`ALL BUCKETS`, response);

            if (response === undefined || response === null) {
                console.error('Bucket is undefined or null');
                setCustomerOrder(null); // Set empty state
                return;
            }

            console.log(`ToPay BUCKET ${response.ToPay}`);
            // Check if the response is valid and has the expected structure
            if (response && typeof response === 'object') {
                setCustomerOrder({
                    Processing: response.Processing || [],
                    Shipped: response.Shipped || [],
                    Delivered: response.Delivered || [],
                    Cancelled: response.Cancelled || [],
                    Refunded: response.Refunded || [],
                });
            } else {
                console.error(
                    'Expected an object with order arrays but got:',
                    response
                );
                // Maintain the structure of customerOrder even in error cases
                setCustomerOrder({
                    Processing: [],
                    Shipped: [],
                    Delivered: [],
                    Cancelled: [],
                    Refunded: [],
                });
            }
        } catch (error) {
            console.error('Error fetching order buckets:', error);
            setCustomerOrder({
                Processing: [],
                Shipped: [],
                Delivered: [],
                Cancelled: [],
                Refunded: [],
            });
        }
    };

    const areAllOrdersEmpty = customerOrder
        ? Object.values(customerOrder).every(
              (orderArray) => orderArray.length === 0
          )
        : true; // if customerOrder is null or undefined, consider all orders empty
    console.log(`Are all orders empty ${areAllOrdersEmpty}`);

    return (
        <Box>
            {!areAllOrdersEmpty ? (
                <Box>
                    <Box mt={4} mb={2}>
                        <Processing customer={customer} />
                    </Box>
                    <Box mt={4} mb={2}>
                        <Shipped customer={customer} />
                    </Box>
                    <Box mt={4} mb={2}>
                        <Delivered customer={customer} />
                    </Box>
                    <Box mt={4} mb={2}>
                        <Cancelled customer={customer} />
                    </Box>
                    <Box mt={4} mb={2}>
                        <Refund customer={customer} />
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
        </Box>
    );
};

export default All;
