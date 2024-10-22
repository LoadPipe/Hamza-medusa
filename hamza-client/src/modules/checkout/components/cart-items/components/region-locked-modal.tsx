import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    Flex,
} from '@chakra-ui/react';
import { LineItem } from '@medusajs/medusa';
import RemoveProductsButton from './remove-products-button';

type ExtendedLineItem = LineItem & {
    currency_code?: string;
};

type RegionLockedModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    lockedItems: Omit<ExtendedLineItem, 'beforeInsert'>[];
};

const RegionLockedModal: React.FC<RegionLockedModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    lockedItems,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Region-Locked Items</ModalHeader>
                <ModalBody>
                    <Text>
                        The following items are not available in your region:
                    </Text>
                    <Flex direction="column" mt={4} gap={4}>
                        {lockedItems.map((item) => (
                            <Flex
                                key={item.id}
                                alignItems="center"
                                justifyContent="space-between"
                            >
                                <Text>- {item.title}</Text>
                            </Flex>
                        ))}
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                    <Button colorScheme="red" onClick={onConfirm}>
                        Confirm All
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default RegionLockedModal;
