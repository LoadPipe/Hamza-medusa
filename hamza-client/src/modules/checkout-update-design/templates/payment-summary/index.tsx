import React from 'react';
import { Flex, Text, Divider, Button } from '@chakra-ui/react';

const PaymentSummary = () => {
    return (
        <Flex
            bgColor={'#121212'}
            color={'white'}
            maxW={{ base: '100%', md: '401px' }}
            width={'100%'}
            height={{ base: 'auto', md: '480px' }}
            flexDir={'column'}
            borderRadius={'16px'}
            p={{ base: '16px', md: '40px' }}
        >
            <Text
                color={'primary.green.900'}
                fontSize={'18px'}
                fontWeight={600}
            >
                Payment Summary
            </Text>

            <Flex my="2rem" flexDir="column" gap={{ base: 2, md: 4 }}>
                <Text fontSize={{ base: '14px', md: '16px' }}>Subtotal</Text>
                <Text fontSize={{ base: '14px', md: '16px' }}>Discount</Text>
                <Text fontSize={{ base: '14px', md: '16px' }}>
                    Shipping Fee
                </Text>
                <Text fontSize={{ base: '14px', md: '16px' }}>Vat (5%)</Text>
                <Divider
                    my={{ base: '1rem', md: '0' }}
                    borderWidth={'1px'}
                    borderColor={'#3E3E3E'}
                />
                <Text fontSize={{ base: '14px', md: '16px' }}>Total</Text>
            </Flex>

            <Flex mt="auto" flexDir={'column'} gap={5}>
                <Button
                    borderRadius={'full'}
                    height={{ base: '42px', md: '58px' }}
                    opacity={1}
                    color={'white'}
                    _hover={{ opacity: 0.5 }}
                    backgroundColor={'primary.indigo.900'}
                >
                    Confirm Order
                </Button>
                <Text
                    textAlign="center"
                    fontSize={{ base: '10px', md: '12px' }}
                    maxW={'236px'}
                    mx="auto"
                >
                    By clicking on confirm order, you agree to these{' '}
                    <Text
                        as="span"
                        color="primary.indigo.900"
                        cursor={'pointer'}
                        opacity={1}
                        _hover={{ opacity: 0.7 }}
                    >
                        {' '}
                        Terms and Conditions.
                    </Text>
                </Text>
            </Flex>
        </Flex>
    );
};

export default PaymentSummary;
