import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Text,
} from '@chakra-ui/react';

interface CancellationModalProps {
    isOpen: boolean;
    onClose: () => void;
    cancelReason?: string;
    canceledAt?: string | null;
}

const CancellationModal: React.FC<CancellationModalProps> = ({
    isOpen,
    onClose,
    cancelReason = 'No cancellation details were provided.',
    canceledAt = null,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">
                    Cancellation Details
                </ModalHeader>
                <ModalBody>
                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                        Reason for Cancellation:
                    </Text>
                    <Text mb={2}>{cancelReason}</Text>

                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                        Cancellation Date:
                    </Text>
                    <Text>
                        {canceledAt
                            ? new Date(canceledAt).toLocaleDateString(
                                  undefined,
                                  {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                  }
                              )
                            : 'Cancel date N/A'}
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CancellationModal;
