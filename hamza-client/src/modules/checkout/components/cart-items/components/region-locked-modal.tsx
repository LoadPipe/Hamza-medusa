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
    Flex,
} from '@chakra-ui/react';
import { LineItem } from '@medusajs/medusa';
import Thumbnail from '@modules/products/components/thumbnail';

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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            closeOnOverlayClick={false}
            closeOnEsc={false}
        >
            <ModalOverlay />
            <ModalContent
                backgroundColor={'#121212'}
                color={'white'}
                p={4}
                borderRadius={'12px'}
            >
                <ModalHeader color={'primary.green.900'}>
                    Region-Locked Items
                </ModalHeader>
                <ModalBody>
                    <Text>
                        The following items are not available in your region:
                    </Text>
                    <Flex direction="column" mt={4} gap={4}>
                        {lockedItems.map((item) => (
                            <Flex key={item.id} alignItems="center">
                                <Flex
                                    alignSelf={'center'}
                                    width={{ base: '60px', md: '110px' }}
                                    height={{ base: '60px', md: '110px' }}
                                >
                                    <Thumbnail
                                        thumbnail={
                                            item?.variant?.metadata?.imgUrl ??
                                            item?.thumbnail
                                        }
                                        size="square"
                                    />
                                </Flex>
                                <Text ml="1rem">- {item.title}</Text>
                            </Flex>
                        ))}
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button
                        color={'white'}
                        backgroundColor={'primary.indigo.900'}
                        borderRadius={'full'}
                        opacity={1}
                        _hover={{ opacity: 0.5 }}
                        onClick={onConfirm}
                    >
                        Remove & Continue
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default RegionLockedModal;
