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
                <ModalContent maxWidth={'760px'}>
                    <ModalHeader>Shipping, returns, and payments</ModalHeader>
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
                                <TabPanel>
                                    <Text>
                                        At Hamza, we aim to provide a seamless,
                                        secure, and flexible payment experience
                                        by offering multiple cryptocurrency
                                        options. Please read our Payment Method
                                        Policy to understand how payments work
                                        on our platform.
                                    </Text>

                                    <Text mt={4}>
                                        Hamza supports payments using the
                                        following cryptocurrencies:
                                    </Text>

                                    <Text ml={4}>
                                        • Bitcoin (BTC) <br />
                                        • Ethereum (ETH) <br />
                                        • Tether (USDT) <br />
                                        • USD Coin (USDC) <br />
                                        • Binance Coin (BNB) <br />
                                        • Litecoin (LTC) <br />
                                        • Ripple (XRP) <br />
                                        • Polygon (MATIC) <br />
                                        • Dogecoin (DOGE) <br />
                                        • Dai (DAI) <br />• Solana (SOL)
                                    </Text>

                                    <Text mt={4}>
                                        We are continuously expanding our list
                                        of supported cryptocurrencies to
                                        accommodate more options for buyers and
                                        sellers. The available payment methods
                                        for each transaction will be displayed
                                        at checkout.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Blockchain Security:
                                    </Text>
                                    <Text>
                                        All transactions on Hamza are secured by
                                        blockchain technology, ensuring
                                        transparency, immutability, and
                                        security.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Two-Factor Authentication (2FA):
                                    </Text>
                                    <Text>
                                        We recommend enabling two-factor
                                        authentication (2FA) on your account for
                                        added security during transactions.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Escrow Protection:
                                    </Text>
                                    <Text>
                                        For high-value transactions, Hamza may
                                        offer escrow services where the funds
                                        are temporarily held in a secure account
                                        until both parties confirm that the
                                        transaction is complete.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Payment Process
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Selecting a Payment Method:
                                    </Text>
                                    <Text>
                                        • During the checkout process, buyers
                                        will have the option to choose their
                                        preferred cryptocurrency. The equivalent
                                        amount in the chosen cryptocurrency will
                                        be calculated based on the current
                                        market exchange rate at the time of
                                        purchase.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Wallet Connectivity:
                                    </Text>
                                    <Text>
                                        • Buyers must connect their
                                        cryptocurrency wallet to Hamza’s
                                        platform for the payment to be
                                        processed. We support popular wallet
                                        integrations like MetaMask, Trust
                                        Wallet, and others.
                                        <br /> • Ensure that your wallet is
                                        funded with enough cryptocurrency to
                                        cover the total amount, including any
                                        potential transaction or gas fees.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Transaction Confirmation:
                                    </Text>
                                    <Text>
                                        • Once payment is initiated, buyers will
                                        receive a confirmation prompt from their
                                        connected wallet to approve the
                                        transaction. <br /> • Transactions
                                        typically take a few minutes to confirm
                                        on the blockchain. Upon confirmation,
                                        both the buyer and seller will receive
                                        notification of a successful payment.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Fees
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Transaction Fees:
                                    </Text>
                                    <Text>
                                        • Cryptocurrency payments may incur
                                        network or "gas" fees depending on the
                                        blockchain used for the transaction.
                                        These fees are set by the blockchain
                                        network and are not controlled by Hamza.
                                        <br />• Buyers are responsible for
                                        covering any transaction fees associated
                                        with their payment. The total amount,
                                        including fees, will be displayed at
                                        checkout.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Seller Fees:
                                    </Text>
                                    <Text>
                                        • Sellers may be subject to a small
                                        transaction fee on each sale, which
                                        covers the cost of payment processing.
                                        This fee will be deducted automatically
                                        from the payment amount.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Refunds and Payment Reversals
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Cryptocurrency Refunds:
                                    </Text>
                                    <Text>
                                        • If a refund is requested and approved
                                        (per Hamza's Return Policy), refunds
                                        will be processed in the original
                                        cryptocurrency used for the transaction.
                                        <br />• The refund amount will be
                                        calculated based on the cryptocurrency’s
                                        value at the time of purchase, not at
                                        the time of the refund.
                                        <br />• Refunds are generally processed
                                        within 5-7 business days after approval.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Partial Refunds:
                                    </Text>
                                    <Text>
                                        • If only a partial refund is requested
                                        and approved, the same process applies,
                                        with the equivalent amount in
                                        cryptocurrency being refunded to the
                                        buyer.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Handling Payment Disputes
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Disputes Between Buyers and Sellers:
                                    </Text>
                                    <Text>
                                        • In case of payment-related disputes,
                                        buyers and sellers are encouraged to
                                        resolve the issue through Hamza’s
                                        messaging platform. If a resolution
                                        cannot be reached, Hamza offers a
                                        Dispute Resolution Process.
                                        <br /> • Contact our support team with
                                        the necessary documentation (transaction
                                        ID, order number, proof of
                                        communication) to start a formal
                                        dispute.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Fraud Prevention:
                                    </Text>
                                    <Text>
                                        • To prevent fraudulent activity, Hamza
                                        monitors transactions for unusual
                                        behavior. If suspicious activity is
                                        detected, we reserve the right to
                                        temporarily hold the funds until the
                                        situation is reviewed. <br /> • In case
                                        of confirmed fraud, we will take
                                        appropriate measures, which may include
                                        reversing transactions or suspending
                                        accounts.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Failed or Rejected Payments
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Insufficient Funds:
                                    </Text>
                                    <Text>
                                        • If the cryptocurrency wallet does not
                                        have enough funds to cover the
                                        transaction (including fees), the
                                        payment will fail, and the buyer will
                                        need to retry with a sufficient balance.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Network Issues:
                                    </Text>
                                    <Text>
                                        • On rare occasions, network congestion
                                        or blockchain delays may result in
                                        failed transactions. In such cases, the
                                        buyer should try again after some time
                                        or contact our support team for
                                        assistance.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Incorrect Wallet Address:
                                    </Text>
                                    <Text>
                                        • Buyers must ensure that the correct
                                        wallet address is provided for payments.
                                        Hamza is not responsible for payments
                                        sent to incorrect wallet addresses.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Legal and Regulatory Compliance
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        KYC (Know Your Customer):
                                    </Text>
                                    <Text>
                                        • For higher-value transactions or
                                        certain jurisdictions, Hamza may require
                                        buyers and sellers to complete KYC
                                        verification. This helps prevent money
                                        laundering, fraud, and other illegal
                                        activities.
                                    </Text>

                                    <Text mt={4} fontWeight="bold">
                                        Local Regulations:
                                    </Text>
                                    <Text>
                                        • Hamza complies with local
                                        cryptocurrency regulations in various
                                        regions. It is the responsibility of
                                        both buyers and sellers to ensure that
                                        their transactions comply with local
                                        laws regarding the use of cryptocurrency
                                        for payments.
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
