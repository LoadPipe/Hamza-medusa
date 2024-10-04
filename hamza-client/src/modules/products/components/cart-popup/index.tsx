import {
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import React from 'react';

type Props = {
    open: boolean;
    description: string;
    closeModal: () => void;
};

function CartPopup({ closeModal, open, description }: Props) {
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
                textAlign="center"
                gap={2}
            >
                <ModalCloseButton color="white" />
                <ModalBody
                    display="flex"
                    justifyContent={'center'}
                    alignItems={'center'}
                    flexDir={'column'}
                >
                    <CheckCircleIcon boxSize={12} color="#94D42A" />

                    <ModalHeader fontSize="24px" fontWeight="bold">
                        Added to Cart
                    </ModalHeader>
                    <Text fontSize="16px" maxW={'332px'} width={'100%'}>
                        {description}
                    </Text>
                </ModalBody>
                <ModalFooter width={'100%'} flex={1}>
                    <Flex gap="16px" width={'100%'}>
                        <Button
                            borderRadius={'full'}
                            height={'52px'}
                            p="16px"
                            borderColor={'primary.indigo.900'}
                            borderWidth={'1px'}
                            backgroundColor={'transparent'}
                            color={'primary.indigo.900'}
                            flex="1"
                        >
                            Shop
                        </Button>
                        <Button
                            borderRadius={'full'}
                            height={'52px'}
                            p="16px"
                            backgroundColor={'primary.indigo.900'}
                            flex="1"
                        >
                            Checkout
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default CartPopup;
