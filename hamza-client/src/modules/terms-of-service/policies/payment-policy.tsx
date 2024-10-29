import {
    Flex,
    Text,
    UnorderedList,
    ListItem,
    TabPanel,
} from '@chakra-ui/react';
import React from 'react';

const PaymentPolicy = ({ is_checkout = false }: { is_checkout?: boolean }) => {
    return is_checkout ? (
        <Flex
            flexDirection="column"
            fontSize={{ base: '14px', md: '16px' }}
            lineHeight={{ base: '1.6', md: '1.8' }}
            p={{ base: 4, md: 6 }}
            textAlign="left"
        >
            <PaymentContent />
        </Flex>
    ) : (
        <TabPanel
            fontSize={{ base: '14px', md: '16px' }}
            lineHeight={{ base: '1.6', md: '1.8' }}
            p={{ base: 4, md: 6 }}
            textAlign="left"
        >
            <PaymentContent />
        </TabPanel>
    );
};

export default PaymentPolicy;

const PaymentContent = () => (
    <>
        {/* Header */}
        <Text fontWeight="bold" fontSize={{ base: '18px', md: '20px' }} mb={4}>
            Payment Policies and Cancellation
        </Text>
        <Text mb={4}>
            Hamza marketplace operates entirely using cryptocurrency for all
            transactions. Please review the following policies carefully to
            understand how payments are handled on the platform.
        </Text>

        {/* Supported Cryptocurrencies */}
        <Text fontWeight="bold" mb={4}>
            1. Supported Cryptocurrencies
        </Text>
        <Text mb={4}>
            Sellers on our marketplace accept the following cryptocurrencies as
            payment:
        </Text>
        <UnorderedList ml={8} mb={4}>
            <ListItem>Ethereum (ETH)</ListItem>
            <ListItem>Stablecoins (e.g., USDT, USDC)</ListItem>
            <ListItem>
                Other cryptocurrencies may be added from time to time.
            </ListItem>
        </UnorderedList>
        <Text mb={4}>
            When purchasing an item, buyers must ensure they have the correct
            cryptocurrency accepted by the seller and the correct amount
            available in their wallet to complete the payment. Since sellers
            directly accept cryptocurrency, there are no conversion rates or
            fiat currency involved in the transaction. Any order that is
            canceled or eligible for a refund will be refunded to the same
            wallet address used for the purchase, and in the same cryptocurrency
            that was originally used for payment.
        </Text>

        {/* Transaction Fees */}
        <Text fontWeight="bold" mb={4}>
            2. Transaction Fees
        </Text>
        <Text mb={4}>
            The marketplace charges a fixed service fee of 5% which is already
            included in all listing prices. The platform’s fee includes the
            escrow service, which is mandatory to provide additional protection
            during the transaction until the goods are delivered and the
            transaction is completed.
        </Text>
        <Text mb={4}>
            Additionally, there will be a transaction (gas) fee based on the
            specific cryptocurrency you are using. Gas fees vary depending on
            network congestion at the time of the transaction and are required
            to process the payment on the blockchain. Any applicable gas fees
            will be clearly displayed before you confirm the payment. Make sure
            to account for these fees when sending your cryptocurrency.
        </Text>

        {/* Transaction Finality */}
        <Text fontWeight="bold" mb={4}>
            3. Transaction Finality
        </Text>
        <Text mb={4}>
            Cryptocurrency transactions are{' '}
            <strong>final and irreversible</strong>. Once you make a payment and
            the funds are placed in escrow, the transaction is binding. After
            the goods are delivered and the escrow is released to the Seller,
            funds cannot be refunded or returned, so it is important to
            carefully review the transaction before finalizing it.
        </Text>
        <Text mb={4}>
            Please double-check all payment details, including the amount,
            shipping address, and the item description, before confirming a
            purchase. Any disputes must be resolved through the marketplace’s
            dispute resolution process, as outlined in these Terms.
        </Text>

        {/* Cancellation */}
        <Text fontWeight="bold" mb={4}>
            4. Cancellation
        </Text>
        <UnorderedList ml={8} mb={4}>
            <ListItem>
                Buyers can cancel the order any time prior to acceptance by the
                Seller.
            </ListItem>
            <ListItem>
                Once accepted, the order can be cancelled for the next six (6)
                hours (“the grace period”). Beyond this time, Seller consent
                will be required. The Seller should not refuse cancellation
                without a valid reason, including but not limited to:
                <UnorderedList ml={8} mt={2}>
                    <ListItem>Force majeure</ListItem>
                    <ListItem>Wrong product ordered</ListItem>
                    <ListItem>Duplicate orders</ListItem>
                    <ListItem>Over or under payment</ListItem>
                    <ListItem>Listing product mistake</ListItem>
                    <ListItem>Price mistake</ListItem>
                    <ListItem>
                        Incomplete or wrong buyer or shipping information
                    </ListItem>
                    <ListItem>Product recall or defect</ListItem>
                    <ListItem>
                        Unavailability of shipping services or restrictions to
                        certain locations (sanctions or embargoes)
                    </ListItem>
                    <ListItem>Payment issues</ListItem>
                    <ListItem>
                        Identity theft, abnormal buying patterns, or attempts to
                        scam sellers.
                    </ListItem>
                </UnorderedList>
            </ListItem>
            <ListItem>Once shipped, the order cannot be cancelled.</ListItem>
        </UnorderedList>
        <Text fontStyle="italic" mb={4}>
            Note: Some Sellers do not accept cancellations.
        </Text>
    </>
);
