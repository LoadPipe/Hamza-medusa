import {
    Box,
    Button,
    Flex,
    Link as ChakraLink,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import NextLink from 'next/link';
import { FaRegCheckCircle } from 'react-icons/fa';

type Props = {
    open: boolean;
    productName: string;
    closeModal: () => void;
};

function CartPopup({ closeModal, open, productName }: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckoutClick = () => {
        setIsLoading(true);
    };

    return (
        <Modal isCentered isOpen={open} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent
                bg="#121212"
                p="40px"
                borderRadius={'16px'}
                justifyContent={'center'}
                alignItems={'center'}
                color="white"
                gap={2}
                maxW={'496px'} // Corrected calc syntax
                width={'100%'}
            >
                <ModalCloseButton color="white" />
                <ModalBody
                    display="flex"
                    justifyContent={'center'}
                    alignItems={'center'}
                    flexDir={'column'}
                >
                    <FaRegCheckCircle size={72} color="#94D42A" />

                    <ModalHeader
                        fontSize="24px"
                        fontWeight="bold"
                        textAlign={'center'}
                    >
                        Added to Cart
                    </ModalHeader>
                    <Text
                        fontSize="16px"
                        maxW={'332px'}
                        width={'100%'}
                        textAlign={'center'}
                    >
                        {productName}
                    </Text>
                </ModalBody>
                <ModalFooter width={'100%'}>
                    <Flex
                        gap="16px"
                        width={'100%'}
                        flexDir={{ base: 'column', md: 'row' }}
                        justifyContent="center"
                    >
                        <Button
                            borderRadius={'full'}
                            height={'52px'}
                            p="16px"
                            borderColor={'primary.indigo.900'}
                            borderWidth={'1px'}
                            backgroundColor={'transparent'}
                            color={'primary.indigo.900'}
                            onClick={closeModal}
                            minWidth={{ base: '100%', md: '200px' }}
                            flexShrink={0}
                        >
                            Continue Shopping
                        </Button>
                        <ChakraLink
                            as={NextLink}
                            href="/checkout?step=address"
                            style={{ textDecoration: 'none' }}
                            onClick={handleCheckoutClick}
                        >
                            <Button
                                borderRadius={'full'}
                                height={'52px'}
                                p="16px"
                                backgroundColor={'primary.indigo.900'}
                                minWidth={{ base: '100%', md: '200px' }}
                                flexShrink={0}
                                isLoading={isLoading}
                            >
                                Go to Checkout
                            </Button>
                        </ChakraLink>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default CartPopup;
