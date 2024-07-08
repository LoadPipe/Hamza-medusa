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
        <Box
            py={6}
            minH="calc(100vh - 64px)"
            mx="1rem"
            justifyContent={'center'}
            alignItems={'center'}
        >
            <Flex
                direction="column"
                justifyContent={'center'}
                alignItems={'center'}
                gap={10}
                maxW="4xl"
                h="full"
                w="full"
                mx="auto"
            >
                {isOnboarding && <OnboardingCta orderId={order.id} />}
                <Box
                    p={6}
                    bg="white"
                    w="full"
                    py={10}
                    boxShadow="md"
                    rounded="lg"
                >
                    <VStack spacing={4} align="center" w="full">
                        <Heading as="h1" size="lg" mb={4} textAlign="center">
                            Thank you!
                        </Heading>
                        <Text textAlign="center">
                            Your order was placed successfully.
                        </Text>
                        <OrderDetails order={order} />
                        <Heading as="h2" size="md" textAlign="center">
                            Summary
                        </Heading>
                        <Summary cart_id={order.cart_id} />
                        <PaymentDetails order={order} />
                        <Help />
                    </VStack>
                </Box>
            </Flex>
        </Box>
    );
}
