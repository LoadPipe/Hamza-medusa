import { Order } from '@medusajs/medusa';
import { cookies } from 'next/headers';
import { Box, Flex, Heading, VStack, Text } from '@chakra-ui/react';
import CartTotals from '@modules/common/components/cart-totals';
import Help from '@modules/order/components/help';
import Items from '@modules/order/components/items';
import OnboardingCta from '@modules/order/components/onboarding-cta';
import OrderDetails from '@modules/order/components/order-details';
import ShippingDetails from '@modules/order/components/shipping-details';
import PaymentDetails from '@modules/order/components/payment-details';
import Summary from '@modules/order/components/summary';
import { MdOutlineCheckCircle } from 'react-icons/md';

type OrderCompletedTemplateProps = {
    order: Order;
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
            p={'40px'}
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
            <Text>Thank you for your order!</Text>

            <Text mt="1rem">
                Order confirmation has been sent to your registered email
            </Text>
            <OrderDetails order={order} />
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
