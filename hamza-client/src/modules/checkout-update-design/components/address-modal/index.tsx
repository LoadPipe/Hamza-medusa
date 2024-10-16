import {
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Box,
    Text,
} from '@chakra-ui/react';
import React from 'react';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent maxW="737px" maxH="775px" p="6" bgColor={'#121212'}>
                <ModalHeader
                    color={'primary.green.900'}
                    textAlign={'center'}
                    fontSize={'24px'}
                >
                    Add New Address
                </ModalHeader>
                <ModalCloseButton color={'white'} />
                <ModalBody>
                    <Flex flexDir="column" gap="8">
                        {/* Name Fields */}
                        <Flex gap="4" flexDir={{ base: 'column', md: 'row' }}>
                            <FormControl isRequired>
                                <Input
                                    placeholder="Full Name"
                                    height={'50px'}
                                    fontSize={'14px'}
                                    bgColor={'#040404'}
                                    borderWidth={0}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <Input
                                    placeholder="Phone Number"
                                    height={'50px'}
                                    fontSize={'14px'}
                                    bgColor={'#040404'}
                                    borderWidth={0}
                                />
                            </FormControl>
                        </Flex>

                        {/* Address Fields */}
                        <FormControl isRequired>
                            <Input
                                placeholder="Address 1"
                                height={'50px'}
                                fontSize={'14px'}
                                bgColor={'#040404'}
                                borderWidth={0}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Address 2"
                                height={'50px'}
                                fontSize={'14px'}
                                bgColor={'#040404'}
                                borderWidth={0}
                            />
                        </FormControl>

                        {/* City, State, Country, Zip Code */}
                        <Flex gap="4" flexDir={{ base: 'column', md: 'row' }}>
                            <FormControl isRequired>
                                <Input
                                    placeholder="City"
                                    bgColor={'#040404'}
                                    height={'50px'}
                                    fontSize={'14px'}
                                    borderWidth={0}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <Input
                                    placeholder="State"
                                    height={'50px'}
                                    fontSize={'14px'}
                                    bgColor={'#040404'}
                                    borderWidth={0}
                                />
                            </FormControl>
                        </Flex>

                        <Flex gap="4" flexDir={{ base: 'column', md: 'row' }}>
                            <FormControl isRequired>
                                <Input
                                    placeholder="Country"
                                    bgColor={'#040404'}
                                    height={'50px'}
                                    fontSize={'14px'}
                                    borderWidth={0}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <Input
                                    placeholder="Zip Code"
                                    height={'50px'}
                                    fontSize={'14px'}
                                    bgColor={'#040404'}
                                    borderWidth={0}
                                />
                            </FormControl>
                        </Flex>

                        {/* Checkbox for Default Address */}
                        <Flex alignItems="center" my="3" color={'white'}>
                            <Checkbox mr="2" />
                            <Text alignSelf={'center'}>
                                Set address as default
                            </Text>
                        </Flex>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Flex w="100%" gap="4">
                        <Button
                            onClick={onClose}
                            flex="1"
                            variant="outline"
                            borderColor={'primary.indigo.900'}
                            color={'primary.indigo.900'}
                            height={'52px'}
                            borderRadius={'full'}
                            opacity={1}
                            _hover={{ opacity: 0.5 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            colorScheme="blue"
                            backgroundColor={'primary.indigo.900'}
                            flex="1"
                            height={'52px'}
                            borderRadius={'full'}
                            opacity={1}
                            _hover={{ opacity: 0.5 }}
                        >
                            Add Address
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddressModal;
