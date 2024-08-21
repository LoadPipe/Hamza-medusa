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
    cart: Cart;
};

//TODO: replace the following back in the template, when working
/*
          <Items items={line-item.items} region={line-item.region} />
          <ShippingDetails line-item={line-item} />
*/

export default function OrderCompletedTemplate({
    order,
    cart,
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
            <Text as="h1" fontSize={'24px'} fontWeight={700}>
                Payment Successful!
            </Text>
            <Text fontWeight={600}>Thank you for your order!</Text>

            <Text mt="1rem" textAlign={'center'}>
                Order confirmation has been sent to your registered email
            </Text>

            <OrderDetails order={order} />
            <Divider my="2rem" borderColor="#555555" />
            <Summary cart_id={order.cart_id} />
            <Divider my="1rem" borderColor="#555555" />
            <TransactionDetails data={cart} />

            <Flex
                height={'52px'}
                mt="2rem"
                bgColor="primary.indigo.900"
                width={'100%'}
                justifyContent={'center'}
                alignItems={'center'}
                borderRadius={'full'}
                cursor={'pointer'}
            >
                <Text>Check Order Status</Text>
            </Flex>

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
