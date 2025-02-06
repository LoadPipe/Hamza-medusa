import { Cart, Order } from '@medusajs/medusa';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { Box, Flex, Text, Divider } from '@chakra-ui/react';
import OnboardingCta from '@modules/order/components/onboarding-cta';
import OrderDetails from '@modules/order/components/order-details';
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

            <Box
                color="primary.green.900"
                mb="1rem"
                fontSize={{ base: '40px', md: '72px' }}
            >
                <MdOutlineCheckCircle />
            </Box>
            <Text fontSize={'24px'} fontWeight={700}>
                Payment Successful!
            </Text>
            <Text fontWeight={600} fontSize={{ base: '14px', md: '16px' }}>
                Thank you for your order!
            </Text>

            <Text
                mt="1rem"
                textAlign={'center'}
                fontSize={{ base: '14px', md: '16px' }}
            >
                Order confirmation has been sent to your registered email
            </Text>

            {/* Order Body */}
            <OrderDetails cart={cart} />
            <Divider my="2rem" borderColor="#555555" />
            <Summary cart={cart} />

            <TransactionDetails data={cart} />

            {/* Check Order Button */}
            <Link href="/account/orders" style={{ width: '100%' }}>
                <Flex
                    height={{ base: '42px', md: '52px' }}
                    mt="2rem"
                    bgColor="primary.indigo.900"
                    justifyContent={'center'}
                    alignItems={'center'}
                    borderRadius={'full'}
                    cursor={'pointer'}
                >
                    <Text fontSize={{ base: '14px', md: '16px' }}>
                        Check Order Status
                    </Text>
                </Flex>
            </Link>
        </Flex>
    );
}
