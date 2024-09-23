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

const TermsOfService = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const openModal = (tabIndex) => {
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
                <ModalContent>
                    <ModalHeader>Terms and Conditions</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Tabs
                            index={selectedTab}
                            onChange={setSelectedTab}
                            variant="enclosed"
                        >
                            <TabList>
                                <Tab flex={1}>Shipping</Tab>
                                <Tab flex={1}>Returns</Tab>
                                <Tab flex={1}>Payment Methods</Tab>
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
                                        1. Return Eligibility
                                    </Text>
                                    <Text mt={2}>
                                        • Items must be returned within 30 days
                                        of the delivery date to be eligible for
                                        a return.
                                    </Text>
                                    <Text mt={2}>
                                        • Products must be in their original
                                        condition, unused, and in their original
                                        packaging. Certain items, such as
                                        perishable goods or personalized
                                        products, may not be eligible for
                                        returns.
                                    </Text>

                                    <Text fontWeight="bold" mt={4}>
                                        2. Return Process
                                    </Text>
                                    <Text mt={2}>
                                        • To initiate a return, contact the
                                        seller directly through your Hamza
                                        account, providing the order number and
                                        reason for return.
                                    </Text>
                                    <Text mt={2}>
                                        • The seller will provide return
                                        instructions, including the return
                                        shipping address and any applicable
                                        return shipping fees.
                                    </Text>

                                    <Text fontWeight="bold" mt={4}>
                                        3. Refunds
                                    </Text>
                                    <Text mt={2}>
                                        • Refunds will be issued once the
                                        returned item is received and inspected
                                        by the seller.
                                    </Text>
                                    <Text mt={2}>
                                        • Refunds will be processed to the
                                        original payment method within 5-7
                                        business days of receiving the returned
                                        item.
                                    </Text>

                                    <Text fontWeight="bold" mt={4}>
                                        4. Return Shipping Costs
                                    </Text>
                                    <Text mt={2}>
                                        • The buyer is responsible for return
                                        shipping costs, unless the return is due
                                        to a seller error (e.g., incorrect item
                                        received).
                                    </Text>
                                    <Text mt={2}>
                                        • In cases of seller error, the seller
                                        will provide a prepaid return shipping
                                        label.
                                    </Text>

                                    <Text fontWeight="bold" mt={4}>
                                        5. Damaged or Defective Items
                                    </Text>
                                    <Text mt={2}>
                                        • If you receive a damaged or defective
                                        item, contact the seller immediately
                                        with photos of the damage or defect.
                                    </Text>
                                    <Text mt={2}>
                                        • The seller will provide instructions
                                        for returning the item and issue a
                                        replacement or refund.
                                    </Text>
                                </TabPanel>

                                {/* Payment Methods Tab Content */}
                                <TabPanel>
                                    <Text>
                                        Here are the payment method terms and
                                        conditions. We accept Visa, Mastercard,
                                        PayPal...
                                    </Text>
                                </TabPanel>
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
