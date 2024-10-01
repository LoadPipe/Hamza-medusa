import { Box, Button, Text } from '@chakra-ui/react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import Processing from '@modules/order/templates/processing';
import Shipped from '@modules/order/templates/shipped';
import Delivered from '@modules/order/templates/delivered';
import Cancelled from '@modules/order/templates/cancelled';
import Refund from '@modules/order/templates/refund';
import { useState } from 'react';

const All = ({
    customer,
    ordersExist,
}: {
    customer: string;
    ordersExist: boolean;
}) => {
    const [processingFetched, setProcessingFetched] = useState(false);
    const [shippedFetched, setShippedFetched] = useState(false);
    const [deliveredFetched, setDeliveredFetched] = useState(false);
    const [cancelledFetched, setCancelledFetched] = useState(false);
    const [refundFetched, setRefundFetched] = useState(false);
    return (
        <Box>
            {ordersExist ? (
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
