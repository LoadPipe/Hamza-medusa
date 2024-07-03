import {
    Box,
    Button,
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
    closeModal: () => void;
};

function CartPopup({ closeModal, open }: Props) {
    return (
        <Modal isCentered isOpen={open} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent
                bg="blackAlpha.900"
                paddingTop={10}
                paddingBottom={10}
                color="white"
                textAlign="center"
            >
                <Box mt={6}>
                    <CheckCircleIcon boxSize={12} color="green.400" />
                </Box>
                <ModalHeader fontSize="2xl" fontWeight="bold" mt={4}>
                    Add to cart Successfully!
                </ModalHeader>
                <ModalCloseButton color="white" />
                <ModalBody mt={-5}>
                    <Text fontSize="lg">
                        Item has been added to your shopping cart.
                    </Text>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default CartPopup;
