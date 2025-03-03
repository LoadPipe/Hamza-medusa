import { Box, Button, Text } from '@chakra-ui/react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import Processing from '@modules/order/templates/processing';
import Shipped from '@modules/order/templates/shipped';
import Delivered from '@modules/order/templates/delivered';
import Cancelled from '@modules/order/templates/cancelled';
import Refund from '@modules/order/templates/refund';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrderBucket } from '@/lib/server';

type Order = {};
export type OrdersData = {
    Processing: Order[];
    Shipped: Order[];
    Delivered: Order[];
    Cancelled: Order[];
    Refunded: Order[];
};

export interface OrderNote {
    id: string
    note: string
    public: boolean
    created_at?: string
    updated_at?: string
}

const All = ({ customer }: { customer: string }) => {
    const [processingFetched, setProcessingFetched] = useState(false);
    const [shippedFetched, setShippedFetched] = useState(false);
    const [deliveredFetched, setDeliveredFetched] = useState(false);
    const [cancelledFetched, setCancelledFetched] = useState(false);

    const { data, error, isLoading } = useQuery<OrdersData>({
        queryKey: ['batchOrders'],
        queryFn: () => getOrderBucket(customer),
        staleTime: 5000, // Keep data fresh for 5 seconds
    });

    // Check if any tab contains data
    const ordersExist =
        data &&
        ((data.Processing && data.Processing.length > 0) ||
            (data.Shipped && data.Shipped.length > 0) ||
            (data.Delivered && data.Delivered.length > 0) ||
            (data.Cancelled && data.Cancelled.length > 0) ||
            (data.Refunded && data.Refunded.length > 0));

    return (
        <React.Fragment>
            {ordersExist ? (
                <React.Fragment>
                    <Processing customer={customer} />
                    <Shipped customer={customer} />
                    <Delivered customer={customer} />
                    <Cancelled customer={customer} />
                    <Refund customer={customer} />
                </React.Fragment>
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
        </React.Fragment>
    );
};

export default All;
