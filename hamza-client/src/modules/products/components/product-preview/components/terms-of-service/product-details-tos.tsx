import { useState } from 'react';
import {
    Flex,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from '@chakra-ui/react';
import React from 'react';
import ShippingpPolicy from './policies/shipping-policy';
import PaymentPolicy from './policies/payment-policy';
import ReturnPolicy from './policies/return-policy';
import { MdCurrencyBitcoin } from 'react-icons/md';
import { FiTruck } from 'react-icons/fi';
import { GiAnticlockwiseRotation } from 'react-icons/gi';
import { BsBoxSeam } from 'react-icons/bs';

const TermsOfService = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const openModal = (tabIndex: any) => {
        setSelectedTab(tabIndex);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <Flex mt="1rem" flexDir={'column'} gap={5}>
            <Flex flexDir={'row'}>
                <Flex maxW={'133px'} width={'100%'} flexDir={'row'} gap={2}>
                    <BsBoxSeam
                        color="white"
                        size={20}
                        style={{ alignSelf: 'center' }}
                    />
                    <Text color={'white'}>Shipping:</Text>
                </Flex>
                <Text
                    textDecor={'underline'}
                    cursor={'pointer'}
                    color="#94D42A"
                    onClick={() => openModal(0)} // Open modal and show Payment Methods tab
                >
                    See shipping policy
                </Text>
            </Flex>

            <Flex flexDir={'row'}>
                <Flex maxW={'133px'} width={'100%'} gap={2}>
                    <GiAnticlockwiseRotation
                        size={20}
                        color="white"
                        style={{
                            marginBottom: 'auto',
                        }}
                    />
                    <Text color={'white'} display={'flex'} flexDir={'row'}>
                        Returns:
                    </Text>
                </Flex>
                <Text color={'white'} cursor={'pointer'}>
                    30 days returns. Buyer pays for return shipping.{' '}
                    <span
                        style={{
                            textDecoration: 'underline',
                            color: '#94D42A',
                        }}
                        onClick={() => openModal(1)} // Open modal and show Returns tab
                    >
                        See returns policy
                    </span>
                </Text>
            </Flex>

            <Flex flexDir={'row'}>
                <Flex maxW={'133px'} width={'100%'} flexDir={'row'} gap={1}>
                    <MdCurrencyBitcoin
                        size={20}
                        color="white"
                        style={{ alignSelf: 'center' }}
                    />
                    <Text color={'white'}>Payments:</Text>
                </Flex>
                <Text
                    textDecor={'underline'}
                    cursor={'pointer'}
                    color="#94D42A"
                    onClick={() => openModal(2)} // Open modal and show Payment Methods tab
                >
                    See payment method policy
                </Text>
            </Flex>

            {/* Modal with Three Options */}
            <Modal isOpen={isOpen} onClose={closeModal} size="lg">
                <ModalOverlay />
                <ModalContent
                    maxWidth={'760px'}
                    backgroundColor={'#121212'}
                    color={'white'}
                >
                    <ModalHeader>Shipping, returns, and payments</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Tabs
                            index={selectedTab}
                            onChange={setSelectedTab}
                            variant="enclosed"
                        >
                            <TabList
                                backgroundColor={'#3E3E3E'}
                                borderBottomWidth={'0px'}
                                borderRadius={'12px'}
                                height={'44px'}
                            >
                                <Tab
                                    backgroundColor={
                                        selectedTab === 0
                                            ? 'primary.green.900'
                                            : '#3E3E3E'
                                    }
                                    borderWidth={'0px'}
                                    borderLeftRadius={'12px'}
                                    borderRightRadius={
                                        selectedTab === 0 ? '12px' : '0px'
                                    }
                                    color={
                                        selectedTab === 0 ? 'black' : 'white'
                                    }
                                    flex={1}
                                >
                                    Shipping
                                </Tab>
                                <Tab
                                    backgroundColor={
                                        selectedTab === 1
                                            ? 'primary.green.900'
                                            : '#3E3E3E'
                                    }
                                    borderWidth={'0px'}
                                    borderRadius={
                                        selectedTab === 1 ? '12px' : '0px'
                                    }
                                    color={
                                        selectedTab === 1 ? 'black' : 'white'
                                    }
                                    flex={1}
                                >
                                    Returns
                                </Tab>
                                <Tab
                                    backgroundColor={
                                        selectedTab === 2
                                            ? 'primary.green.900'
                                            : '#3E3E3E'
                                    }
                                    borderWidth={'0px'}
                                    borderLeftRadius={
                                        selectedTab === 2 ? '12px' : 0
                                    }
                                    borderRightRadius={'12px'}
                                    color={
                                        selectedTab === 2 ? 'black' : 'white'
                                    }
                                    flex={1}
                                >
                                    Payment Methods
                                </Tab>
                            </TabList>
                            <TabPanels>
                                {/* Shipping Tab Content */}
                                <ShippingpPolicy />

                                {/* Returns Tab Content */}
                                <ReturnPolicy />

                                {/* Payment Methods Tab Content */}
                                <PaymentPolicy />
                            </TabPanels>
                        </Tabs>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={closeModal}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default TermsOfService;
