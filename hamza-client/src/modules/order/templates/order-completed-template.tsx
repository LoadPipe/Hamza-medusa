import { Cart, Order } from '@medusajs/medusa';
import { cookies } from 'next/headers';
import { Box, Flex, Heading, VStack, Text, Divider } from '@chakra-ui/react';
import Help from '@modules/order/components/help';
import Items from '@modules/order/components/items';
import OnboardingCta from '@modules/order/components/onboarding-cta';
import OrderDetails from '@modules/order/components/order-details';
import ShippingDetails from '@modules/order/components/shipping-details';
import PaymentDetails from '@modules/order/components/payment-details';
import Summary from '@modules/order/components/summary';
import { MdOutlineCheckCircle } from 'react-icons/md';
import TransactionDetails from '../components/transaction-details';

type OrderCompletedTemplateProps = {
    order: Order;
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | Order;
};

//TODO: replace the following back in the template, when working
/*
          <Items items={line-item.items} region={line-item.region} />
          <CartTotals data={line-item} />
          <ShippingDetails line-item={line-item} />
*/

export default function OrderCompletedTemplate({
    order,
}: OrderCompletedTemplateProps) {
    const isOnboarding = cookies().get('_medusa_onboarding')?.value === 'true';

    return (
        <Flex
            flexDir={'column'}
            width={'100%'}
            maxW={'649px'}
            mt="3rem"
            mb="5rem"
            mx="auto"
            p={{ base: '16px', md: '40px' }}
            borderRadius={'16px'}
            color="white"
            justifyContent={'center'}
            alignItems={'center'}
            backgroundColor={'#121212'}
        >
            {isOnboarding && <OnboardingCta orderId={order.id} />}

            <Box color="primary.green.900" mb="1rem">
                <MdOutlineCheckCircle size={'72px'} />
            </Box>
            <Heading as="h1" size="lg">
                Payment Successful!
            </Heading>
            <Text fontWeight={600}>Thank you for your order!</Text>

            <Text mt="1rem" textAlign={'center'}>
                Order confirmation has been sent to your registered email
            </Text>

            <OrderDetails order={order} />

            <Divider my="2rem" borderColor="#555555" />
            <Summary cart_id={order.cart_id} />
            <Divider my="2rem" borderColor="#555555" />
            <TransactionDetails data={order} />
            <Divider my="1rem" borderColor="#555555" />
            {/* <CartTotals  /> */}
            {/* <OrderDetails order={order} />
                    <Heading as="h2" size="md" textAlign="center">
                        Summary
                    </Heading>
                    <Summary cart_id={order.cart_id} />
                    <PaymentDetails order={order} />
                    <Help /> */}
        </Flex>
    );
}
