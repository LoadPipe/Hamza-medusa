import React from 'react';
import { Flex, Text, Divider, Button } from '@chakra-ui/react';

const PaymentSummary = () => {
    return (
        <Flex
            bgColor={'#121212'}
            color={'white'}
            maxW={{ base: '100%', md: '401px' }}
            width={'100%'}
            height="480px"
            flexDir={'column'}
            borderRadius={'16px'}
            p="40px"
        >
            <Text
                color={'primary.green.900'}
                fontSize={'18px'}
                fontWeight={600}
            >
                Payment Summary
            </Text>

            <Flex my="2rem" flexDir="column" gap={4}>
                <Text>Subtotal</Text>
                <Text>Discount</Text>
                <Text>Shipping Fee</Text>
                <Text>Vat (5%)</Text>
                <Divider borderWidth={'1px'} borderColor={'#3E3E3E'} />
                <Text>Total</Text>
            </Flex>

            <Flex mt="auto" flexDir={'column'} gap={5}>
                <Button
                    borderRadius={'full'}
                    height={'58px'}
                    opacity={1}
                    _hover={{ opacity: 0.5 }}
                    backgroundColor={'primary.indigo.900'}
                >
                    Confirm Order
                </Button>
                <Text textAlign="center" fontSize={'12px'}>
                    By clicking on confirm order, you agree to these Terms and
                    Conditions.
                </Text>
            </Flex>
        </Flex>
    );
};

export default PaymentSummary;
