import { Order, Cart } from '@medusajs/medusa';
// import { Text } from '@medusajs/ui';
import { Box, Text, Flex } from '@chakra-ui/react';

type OrderDetailsProps = {
    cart: Cart;
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

const OrderDetails = ({ cart, showStatus }: OrderDetailsProps) => {
    const formatStatus = (str: string) => {
        const formatted = str.split('_').join(' ');

        return formatted.slice(0, 1).toUpperCase() + formatted.slice(1);
    };

    // const payment = order.payments[0];
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

            <Flex
                mr="auto"
                flexDir={{ base: 'column', md: 'row' }}
                width={'100%'}
            >
                <Flex flexDir={'column'}>
                    <Text
                        fontWeight={600}
                        fontSize={{ base: '14px', md: '16px' }}
                    >
                        Transaction Date
                    </Text>
                    <Text fontSize={{ base: '14px', md: '16px' }}>
                        {new Date(cart.created_at).toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            timeZoneName: 'short',
                        })}
                    </Text>
                </Flex>
            </Flex>

            <Flex
                mt="1rem"
                mr="auto"
                flexDir={{ base: 'column', md: 'row' }}
                width={'100%'}
            >
                <Flex flexDir={'column'}>
                    <Text
                        fontWeight={600}
                        fontSize={{ base: '14px', md: '16px' }}
                    >
                        CART ID
                    </Text>
                    <Text fontSize={{ base: '14px', md: '16px' }}>
                        {cart.id}
                    </Text>
                </Flex>
                <Flex
                    mt={{ base: '1rem', md: '0' }}
                    ml={{ base: '0', md: 'auto' }}
                    flexDir={'column'}
                    width={'200px'}
                >
                    {/*<Text*/}
                    {/*    fontWeight={600}*/}
                    {/*    fontSize={{ base: '14px', md: '16px' }}*/}
                    {/*>*/}
                    {/*    Order Number*/}
                    {/*</Text>*/}
                    {/*<Text fontSize={{ base: '14px', md: '16px' }}>*/}
                    {/*    {cart.display_id}*/}
                    {/*</Text>*/}
                </Flex>
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
