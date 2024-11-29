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
    UnorderedList,
    ListItem,
} from '@chakra-ui/react';
import React from 'react';
import ShippingpPolicy from './policies/shipping-policy';
import PaymentPolicy from './policies/payment-policy';
import ReturnPolicy from './policies/return-policy';
import { MdCurrencyBitcoin } from 'react-icons/md';
import { FiTruck } from 'react-icons/fi';
import { GiAnticlockwiseRotation } from 'react-icons/gi';
import { BsBoxSeam } from 'react-icons/bs';
import { SiBitcoinsv } from 'react-icons/si';
import { CiBitcoin } from 'react-icons/ci';

interface TermsOfServiceProps {
    metadata: any;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ metadata }) => {
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
        <>
            <Flex mt="1rem" flexDir={'column'} gap={{ base: 3, md: 5 }}>
                <Flex
                    flexDir={{ base: 'column', md: 'row' }}
                    gap={{ base: 2, md: 0 }}
                >
                    <Flex maxW={'133px'} width={'100%'} flexDir={'row'} gap={2}>
                        <Flex
                            width={'22px'}
                            height={'22px'}
                            alignSelf={'center'}
                        >
                            <Flex
                                width={'18px'}
                                height={'18px'}
                                mx="auto"
                                alignSelf={'center'}
                            >
                                <BsBoxSeam
                                    color="white"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </Flex>
                        </Flex>
                        <Text
                            color={'white'}
                            fontSize={{ base: '14px', md: '16px' }}
                        >
                            Shipping:
                        </Text>
                    </Flex>
                    <Text
                        textDecor={'underline'}
                        cursor={'pointer'}
                        color="#94D42A"
                        fontSize={{ base: '14px', md: '16px' }}
                        onClick={() => openModal(0)} // Open modal and show Payment Methods tab
                    >
                        See shipping policy
                    </Text>
                </Flex>

                <Flex
                    flexDir={{ base: 'column', md: 'row' }}
                    gap={{ base: 2, md: 0 }}
                >
                    <Flex maxW={'133px'} width={'100%'} flexDir={'row'}>
                        <Flex mb="auto" gap={2}>
                            <Flex
                                width={'22px'}
                                height={'22px'}
                                alignSelf={'center'}
                            >
                                <Flex
                                    width={'20px'}
                                    height={'20px'}
                                    mx="auto"
                                    alignSelf={'center'}
                                >
                                    <GiAnticlockwiseRotation
                                        color="white"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    />
                                </Flex>
                            </Flex>
                            <Text
                                color={'white'}
                                fontSize={{ base: '14px', md: '16px' }}
                            >
                                Returns:
                            </Text>
                        </Flex>
                    </Flex>
                    <Text
                        color={'white'}
                        cursor={'pointer'}
                        fontSize={{ base: '14px', md: '16px' }}
                    >
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

                <Flex
                    flexDir={{ base: 'column', md: 'row' }}
                    gap={{ base: 2, md: 0 }}
                >
                    <Flex maxW={'133px'} width={'100%'} flexDir={'row'} gap={2}>
                        <Flex
                            width={'22px'}
                            height={'22px'}
                            alignSelf={'center'}
                        >
                            <CiBitcoin
                                color="white"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        </Flex>
                        <Text
                            color={'white'}
                            fontSize={{ base: '14px', md: '16px' }}
                        >
                            Payments:
                        </Text>
                    </Flex>
                    <Text
                        textDecor={'underline'}
                        cursor={'pointer'}
                        color="#94D42A"
                        fontSize={{ base: '14px', md: '16px' }}
                        onClick={() => openModal(2)} // Open modal and show Payment Methods tab
                    >
                        See payment method policy
                    </Text>
                </Flex>

                <UnorderedList color={'white'}>
                    <ListItem fontSize={{ base: '14px', md: '16px' }}>
                        Ships from {metadata?.shipsFrom ?? 'Shenzhen, China'}
                    </ListItem>
                    <ListItem mt="1rem" fontSize={{ base: '14px', md: '16px' }}>
                        Allow {metadata?.shippingTime ?? '7-16 business days'}{' '}
                        for delivery
                    </ListItem>
                </UnorderedList>

                {/* Modal with Three Options */}
                <Modal isOpen={isOpen} onClose={closeModal} size="lg">
                    <ModalOverlay />
                    <ModalContent
                        maxWidth={{ base: 'calc(100% - 3rem)', md: '760px' }}
                        backgroundColor={'#121212'}
                        color={'white'}
                    >
                        <ModalHeader maxW={{ base: '253px' }} width={'100%'}>
                            Shipping, returns, and payments
                        </ModalHeader>
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
                                        fontWeight={600}
                                        fontSize={{ base: '14px', md: '16px' }}
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
                                            selectedTab === 0
                                                ? 'black'
                                                : 'white'
                                        }
                                        flex={1}
                                    >
                                        Shipping
                                    </Tab>
                                    <Tab
                                        fontWeight={600}
                                        fontSize={{ base: '14px', md: '16px' }}
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
                                            selectedTab === 1
                                                ? 'black'
                                                : 'white'
                                        }
                                        flex={1}
                                    >
                                        Returns
                                    </Tab>
                                    <Tab
                                        fontWeight={600}
                                        fontSize={{ base: '14px', md: '16px' }}
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
                                            selectedTab === 2
                                                ? 'black'
                                                : 'white'
                                        }
                                        flex={1}
                                        noOfLines={0}
                                        whiteSpace="nowrap"
                                        overflow={'hidden'}
                                        textOverflow="ellipsis"
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
                            <Button
                                fontSize={{ base: '14px', md: '16px' }}
                                backgroundColor={'primary.green.900'}
                                onClick={closeModal}
                            >
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Flex>
        </>
    );
};

export default TermsOfService;
