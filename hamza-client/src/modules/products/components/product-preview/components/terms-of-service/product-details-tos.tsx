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
import ShippingpPolicy from './policies/shipping';
import PaymentPolicy from './policies/payment-policy';

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
                <Flex maxW={'133px'} width={'100%'}>
                    <Text color={'white'}>Returns:</Text>
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
                <Flex maxW={'133px'} width={'100%'}>
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
                            >
                                <Tab
                                    backgroundColor={
                                        selectedTab === 0
                                            ? 'primary.green.900'
                                            : '#3E3E3E'
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
                                <TabPanel>
                                    <Text fontWeight="bold">
                                        1. Shipping Options
                                    </Text>
                                    <Text mt={2}>
                                        At Hamza, sellers offer a variety of
                                        shipping options to suit your needs:
                                    </Text>
                                    <Text mt={2} ml={4}>
                                        • <strong>Standard Shipping:</strong>{' '}
                                        Estimated delivery time ranges between
                                        3-7 business days.
                                    </Text>
                                    <Text mt={2} ml={4}>
                                        • <strong>Express Shipping:</strong> For
                                        faster delivery, estimated between 1-3
                                        business days.
                                    </Text>
                                    <Text mt={2} ml={4}>
                                        •{' '}
                                        <strong>International Shipping:</strong>{' '}
                                        Available for certain products and
                                        sellers. Delivery times vary depending
                                        on the destination country.
                                    </Text>
                                    <Text mt={2}>
                                        Delivery times may vary based on the
                                        seller’s location, shipping carrier, and
                                        product availability.
                                    </Text>

                                    <Text fontWeight="bold" mt={4}>
                                        2. Shipping Costs
                                    </Text>
                                    <Text mt={2}>
                                        • Shipping costs are calculated based on
                                        the weight, size, and destination of the
                                        items. Sellers may offer free shipping
                                        promotions from time to time.
                                    </Text>
                                    <Text mt={2}>
                                        • The total shipping cost will be
                                        displayed at checkout before you
                                        complete your purchase.
                                    </Text>

                                    <Text fontWeight="bold" mt={4}>
                                        3. Order Processing Time
                                    </Text>
                                    <Text mt={2}>
                                        • Sellers typically process and dispatch
                                        orders within 1-3 business days after
                                        purchase confirmation.
                                    </Text>
                                    <Text mt={2}>
                                        • Buyers will receive a notification
                                        with a tracking number (if applicable)
                                        once the order has been shipped.
                                    </Text>

                                    <Text fontWeight="bold" mt={4}>
                                        4. Tracking Your Order
                                    </Text>
                                    <Text mt={2}>
                                        • Once your order is shipped, you will
                                        receive a tracking link via email or
                                        within your Hamza account, allowing you
                                        to track your order in real-time.
                                    </Text>

                                    <Text fontWeight="bold" mt={4}>
                                        5. Shipping Restrictions
                                    </Text>
                                    <Text mt={2}>
                                        • Some products may have shipping
                                        restrictions due to local regulations or
                                        shipping carrier limitations. These
                                        restrictions will be noted on the
                                        product page.
                                    </Text>
                                    <Text mt={2}>
                                        • Certain items may not be eligible for
                                        international shipping, or may require
                                        additional customs fees or import
                                        duties, which are the buyer’s
                                        responsibility.
                                    </Text>

                                    <Text fontWeight="bold" mt={4}>
                                        6. Lost or Delayed Shipments
                                    </Text>
                                    <Text mt={2}>
                                        • In the event of lost or delayed
                                        shipments, buyers are encouraged to
                                        contact the seller directly. If a
                                        resolution cannot be reached, Hamza’s
                                        customer support team can assist in
                                        mediating the issue.
                                    </Text>
                                    <Text mt={2}>
                                        • Shipping delays caused by unforeseen
                                        circumstances (natural disasters,
                                        customs delays, etc.) are beyond Hamza’s
                                        control.
                                    </Text>
                                </TabPanel>

                                {/* Returns Tab Content */}
                                <TabPanel>
                                    <Text fontWeight="bold">
                                        Returns and Refunds
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        1. Return Eligibility
                                    </Text>
                                    <Text mt={2}>
                                        • Most items purchased on Hamza can be
                                        returned within 30 days of delivery,
                                        provided they are in original condition,
                                        unused, and in the original packaging.
                                    </Text>
                                    <Text mt={2}>
                                        • Certain items, such as digital
                                        products, perishable goods, or
                                        customized products, may not be eligible
                                        for return. These exceptions will be
                                        indicated on the product page.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        2. How to Initiate a Return
                                    </Text>
                                    <Text mt={2}>
                                        • Contact the seller directly through
                                        the Hamza platform within the 30-day
                                        return window.
                                    </Text>
                                    <Text mt={2}>
                                        • Provide the order number, reason for
                                        return, and any relevant photos or
                                        documentation.
                                    </Text>
                                    <Text mt={2}>
                                        • The seller will provide further
                                        instructions on how to return the item,
                                        including the return address and
                                        shipping method.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        3. Return Shipping Costs
                                    </Text>
                                    <Text mt={2}>
                                        • Buyers are responsible for covering
                                        the return shipping costs unless the
                                        item was damaged, defective, or
                                        incorrectly delivered.
                                    </Text>
                                    <Text mt={2}>
                                        • If the return is due to an error on
                                        the seller’s part, such as sending the
                                        wrong item or a damaged product, the
                                        seller will typically cover the return
                                        shipping costs.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        4. Refund Process
                                    </Text>
                                    <Text mt={2}>
                                        • Once the seller receives and inspects
                                        the returned item, a refund will be
                                        issued in the original form of payment
                                        or as store credit within 5-7 business
                                        days.
                                    </Text>
                                    <Text mt={2}>
                                        • For payments made with cryptocurrency,
                                        the refund will be processed based on
                                        the market value of the cryptocurrency
                                        at the time of purchase or as agreed
                                        upon by the buyer and seller.
                                    </Text>
                                    <Text mt={2}>
                                        • Buyers will receive a notification
                                        once the refund is processed.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        5. Non-Refundable Items
                                    </Text>
                                    <Text mt={2}>
                                        • Items marked as final sale or
                                        non-returnable (such as digital
                                        products, perishable goods, or
                                        personalized items) cannot be returned
                                        or refunded unless they arrive damaged
                                        or defective.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        6. Damaged or Defective Items
                                    </Text>
                                    <Text mt={2}>
                                        • If you receive an item that is
                                        damaged, defective, or not as described,
                                        contact the seller within 7 days of
                                        receiving the product to report the
                                        issue.
                                    </Text>
                                    <Text mt={2}>
                                        • Provide clear photos of the damage or
                                        defect to facilitate the return process.
                                        The seller will work with you to resolve
                                        the issue, either by offering a
                                        replacement, refund, or other solution.
                                    </Text>
                                </TabPanel>

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
