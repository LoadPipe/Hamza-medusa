import { Flex, Text, Divider, Box } from '@chakra-ui/react';
import React from 'react';
import { BiPencil } from 'react-icons/bi';

const CheckoutDetails = () => {
    return (
        <Flex
            bgColor={'#121212'}
            maxW={'825px'}
            width={'100%'}
            height={'406px'}
            flexDir={'column'}
            borderRadius={'16px'}
            px="60px"
            py="40px"
        >
            <Text
                color={'primary.green.900'}
                fontSize={'18px'}
                fontWeight={600}
            >
                Checkout Details
            </Text>

            <Flex mt="2rem" width={'100%'} flexDir={'row'}>
                <Text
                    color={'primary.green.900'}
                    fontSize={'18px'}
                    fontWeight={600}
                >
                    Shipping To:
                </Text>
                <Box
                    cursor={'pointer'}
                    ml="auto"
                    alignSelf={'center'}
                    color="white"
                    _hover={{ color: 'primary.green.900' }}
                >
                    <BiPencil size={23} />
                </Box>
            </Flex>

            <Divider borderWidth={'1px'} borderColor={'#3E3E3E'} my="2rem" />

            <Flex width={'100%'} flexDir={'row'}>
                <Text
                    color={'primary.green.900'}
                    fontSize={'18px'}
                    fontWeight={600}
                >
                    Payment Method:
                </Text>
                <Box
                    cursor={'pointer'}
                    ml="auto"
                    alignSelf={'center'}
                    color="white"
                    _hover={{ color: 'primary.green.900' }}
                >
                    <BiPencil size={23} />
                </Box>
            </Flex>
        </Flex>
    );
};

export default CheckoutDetails;
