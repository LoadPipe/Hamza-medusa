'use client';

import { Flex, Text, Divider, Box, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { BiPencil } from 'react-icons/bi';
import AddressModal from '@modules/checkout-update-design/components/address-modal';

const CheckoutDetails = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Flex
            bgColor={'#121212'}
            maxW={'825px'}
            width={'100%'}
            height={'406px'}
            flexDir={'column'}
            borderRadius={'16px'}
            px={{ base: '16px', md: '60px' }}
            py={{ base: '16px', md: '40px' }}
        >
            <Text
                color={'primary.green.900'}
                fontSize={'18px'}
                textAlign={{ base: 'center', md: 'unset' }}
                fontWeight={600}
            >
                Checkout Details
            </Text>

            <Flex mt="2rem" width={'100%'} flexDir={'row'}>
                <Text
                    color={'primary.green.900'}
                    fontSize={{ base: '16px', md: '18px' }}
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
                    onClick={onOpen}
                >
                    <BiPencil size={23} />
                </Box>
            </Flex>

            {/* <Divider borderWidth={'1px'} borderColor={'#3E3E3E'} my="2rem" />

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
            </Flex> */}
            {/* Address Modal */}
            <AddressModal isOpen={isOpen} onClose={onClose} />
        </Flex>
    );
};

export default CheckoutDetails;
