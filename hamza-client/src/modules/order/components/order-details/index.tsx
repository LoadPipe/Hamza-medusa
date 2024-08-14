import { Order } from '@medusajs/medusa';
// import { Text } from '@medusajs/ui';
import { Box, Text, Flex } from '@chakra-ui/react';

type OrderDetailsProps = {
    order: Order;
    showStatus?: boolean;
};

//TODO: replace the following at top of template when ready
/*

      <Text>
        We have sent the line-item confirmation details to{" "}
        <span className="text-ui-fg-medium-plus font-semibold">
          {line-item.email}
        </span>
        .
      </Text>
      */

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
    const formatStatus = (str: string) => {
        const formatted = str.split('_').join(' ');

        return formatted.slice(0, 1).toUpperCase() + formatted.slice(1);
    };
    // console.log(`Order Summary is ${JSON.stringify(order)}`);

    return (
        <Flex
            mt="2rem"
            flexDir={'column'}
            width={'100%'}
            justifyContent={'center'}
            alignItems={'center'}
        >
            <Text color={'primary.green.900'} fontSize={'18px'} mb="1rem">
                Order Details
            </Text>
            <Flex flexDirection={'row'} width={'100%'}>
                <Flex mr="auto" flexDir={'column'}>
                    <Text fontWeight={600}>Transaction Date</Text>
                    <Text>{new Date(order.created_at).toDateString()}</Text>
                </Flex>

                <Flex ml="auto" flexDir={'column'}>
                    <Text fontWeight={600}>Order ID</Text>
                    <Text>{order.id}</Text>
                </Flex>
            </Flex>

            <Flex mr="auto" mt="1rem" flexDir={'column'}>
                <Text fontWeight={600}>Order Number</Text>
                <Text>{order.display_id}</Text>
            </Flex>

            {/* <div className="flex items-center text-compact-small gap-x-4 mt-4">
                {showStatus && (
                    <>
                        <Text className="">
                            Order status:{' '}
                            <span className="">
                                {formatStatus(order.fulfillment_status)}
                            </span>
                        </Text>
                        <Text className="">
                            Payment status:{' '}
                            <span className="">
                                {formatStatus(order.payment_status)}
                            </span>
                        </Text>
                    </>
                )}
            </div> */}
        </Flex>
    );
};

export default OrderDetails;
