import { Flex, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import React from 'react';

const DisclaimerPolicy = () => {
    return (
        <Flex
            flexDirection="column"
            fontSize={{ base: '14px', md: '16px' }}
            lineHeight={{ base: '1.6', md: '1.8' }}
            p={{ base: 4, md: 6 }}
            textAlign="left"
        >
            {/* Disclaimer */}
            <Text
                fontSize={{ base: '18px', md: '20px' }}
                fontWeight="bold"
                mb={4}
            >
                1. Disclaimer: Buyer and Seller Transactions
            </Text>
            <Text mb={4}>
                Hamza (the “Platform”) is a decentralized ecommerce marketplace
                which acts solely as a decentralized medium to facilitate
                transactions between buyers and sellers.{' '}
                <strong>
                    The Platform is not a party to any sales transactions
                </strong>
                , and as such, does not own, sell, inspect, or ship any goods
                listed by sellers. All transactions conducted through the
                Platform are strictly between the buyer and seller.
            </Text>

            {/* No Pre-Screening */}
            <Text fontWeight="bold" mb={4}>
                No Pre-Screening of Goods or Sellers
            </Text>
            <Text mb={4}>
                The Platform is a decentralized service and, therefore, does not
                pre-screen or pre-approve the products, listings, or sellers.
                Buyers are solely responsible for reviewing the terms of each
                seller, including processing times, shipping options, and shop
                policies, before making a purchase.
            </Text>

            {/* Illegal Goods */}
            <Text fontWeight="bold" mb={4}>
                Illegal Goods and Prohibited Items
            </Text>
            <Text mb={4}>
                While the Platform does not screen listings, the sale of{' '}
                <strong>illegal goods</strong> and any items that violate local,
                national, or international laws is strictly{' '}
                <strong>prohibited</strong>. This includes but is not limited to
                counterfeit goods, drugs, weapons, stolen property, or items
                that infringe upon intellectual property rights.
            </Text>

            <Text fontWeight="bold" mb={4}>
                Consequences of Violation:
            </Text>
            <UnorderedList ml={8} mb={4}>
                <ListItem>
                    <strong>Immediately suspend or terminate</strong> the user's
                    account.
                </ListItem>
                <ListItem>
                    <strong>Take further legal action</strong>, including
                    reporting to relevant authorities, as deemed necessary.
                </ListItem>
            </UnorderedList>

            {/* Buyer's Due Diligence */}
            <Text fontWeight="bold" mb={4}>
                Buyer’s Due Diligence
            </Text>
            <Text mb={4}>
                It is the <strong>buyer’s responsibility</strong> to conduct due
                diligence and verify the seller’s reputation, product
                descriptions, and terms before committing to a purchase. The
                Platform makes <strong>no guarantees</strong> regarding:
            </Text>
            <UnorderedList ml={8} mb={4}>
                <ListItem>
                    The <strong>quality</strong>, <strong>safety</strong>, or{' '}
                    <strong>legality</strong> of any items listed.
                </ListItem>
                <ListItem>
                    The <strong>accuracy</strong> of the listings.
                </ListItem>
                <ListItem>
                    The seller's ability to deliver the goods or fulfill the
                    contract.
                </ListItem>
            </UnorderedList>

            {/* Limitation of Liability */}
            <Text fontWeight="bold" mb={4}>
                Limitation of Liability
            </Text>
            <Text mb={4}>
                By using the Platform, you acknowledge and agree that{' '}
                <strong>the Platform shall not be held liable</strong> for:
            </Text>
            <UnorderedList ml={8} mb={4}>
                <ListItem>
                    The <strong>conduct of buyers or sellers</strong>, including
                    any fraudulent activities or illegal transactions.
                </ListItem>
                <ListItem>
                    <strong>Losses or damages</strong> arising from your use of
                    the Platform or the purchase and sale of goods, including
                    but not limited to product defects, non-delivery of items,
                    or legal issues regarding the goods sold.
                </ListItem>
                <ListItem>
                    <strong>Cryptocurrency price fluctuations</strong> or losses
                    related to cryptocurrency volatility.
                </ListItem>
            </UnorderedList>
            <Text mb={4}>
                In no event shall the Platform’s total liability to any user for
                all claims related to transactions or use of the Platform exceed
                the amount of fees paid to the Platform by the user in the
                previous 12 months, or $100 USD, whichever is greater.
            </Text>

            {/* Acceptance of Terms */}
            <Text fontWeight="bold" mb={4}>
                Acceptance of Terms
            </Text>
            <Text mb={4}>
                By using our marketplace, you agree to these Terms of Service
                with Hamza Labs Limited, and any other policies we publish on
                the platform. These terms apply every time you visit the
                marketplace, create an account, make a purchase, or list an item
                for sale. If you do not agree with any part of these Terms, you
                may not use our marketplace.
            </Text>
            <Text mb={4}>
                We may update or change these Terms from time to time, and we’ll
                notify you when significant changes are made. Your continued use
                of the platform after any updates means you agree to the new
                terms. Please review the Terms regularly to stay informed of any
                changes.
            </Text>
            <Text mb={4}>
                By accessing or using our platform, you confirm that you
                understand and accept these Terms.
            </Text>

            {/* Account Creation & User Obligations */}
            <Text fontWeight="bold" mb={4}>
                Account Creation & User Obligations
            </Text>
            <Text mb={4}>
                When you create an account on our marketplace, you agree to
                provide accurate and complete information. You are responsible
                for keeping your account details, including your password and
                any cryptocurrency wallet keys, secure. You must be at least 18
                years old to use our platform. If you share your account with
                others, you are fully responsible for their actions.
            </Text>
            <Text mb={4}>
                As a buyer, you can only have one wallet address linked to your
                account at any one time. Your buyer’s wallet is the wallet you
                used to sign in and create a transaction. Until all transactions
                associated with that specific wallet are not concluded, no new
                wallet addresses can be linked to your account as smart
                contracts are programmed to refund payments only to that
                address. Make sure your wallet address is the correct one before
                initiating a transaction.
            </Text>
            <Text mb={4}>
                You agree not to use our platform for any illegal or
                unauthorized purposes, including selling prohibited items or
                engaging in fraudulent transactions. You are responsible for
                complying with all laws that apply to you, including local laws
                regarding the sale of goods and cryptocurrency transactions.
            </Text>
            <Text mb={4}>
                We reserve the right to suspend or terminate your account if we
                believe you are violating our Terms of Service, misusing the
                platform, or engaging in activities that harm other users or the
                marketplace.
            </Text>

            {/* Nature of Transactions */}
            <Text fontWeight="bold" mb={4}>
                Nature of Transactions
            </Text>
            <Text mb={4}>
                Our marketplace operates entirely using cryptocurrency. All
                payments for goods are made in the supported cryptocurrencies,
                which may include Bitcoin, Ethereum, or stable coins like USDT
                and USDC and other digital assets listed on the platform. You
                are responsible for ensuring that you have the necessary
                cryptocurrency to complete your transactions.
            </Text>
            <Text mb={4}>
                To protect both buyers and sellers, our platform uses a smart
                contract escrow system. When a buyer makes a payment, the funds
                are held in escrow until the transaction is completed. The funds
                are released to the seller (in the same cryptocurrency locked in
                the escrow contract) once the buyer confirms they’ve received
                the goods, or after a predetermined period if no dispute is
                raised.
            </Text>
            <Text mb={4}>
                Please be aware that the value of cryptocurrency can fluctuate
                when compared with other asset classes like fiat currencies.
                This means that the price of goods in cryptocurrency might
                change due to market conditions. We do not control these price
                fluctuations, and once a transaction is made, it cannot be
                reversed due to cryptocurrency fluctuation. To avoid
                cryptocurrency fluctuation issues, you may choose to buy or sell
                using stable coins.
            </Text>
            <Text mb={4}>
                All transactions made through the marketplace are final once the
                escrow funds are released. If there is a dispute, our dispute
                resolution process will be followed, as outlined in these Terms.
                See Order Cancellation below for more details.
            </Text>
            <Text mb={4}>
                By using the platform, you agree to the terms of the escrow
                system and accept the risks associated with cryptocurrency
                transactions, including price volatility and the non-reversible
                nature of payments.
            </Text>

            {/* Prohibited Activities */}
            <Text fontWeight="bold" mb={4}>
                Prohibited Activities
            </Text>
            <UnorderedList ml={8} mb={4}>
                <ListItem>
                    <strong>Selling or Buying Illegal Goods:</strong> You may
                    not sell or purchase any items that are illegal under local,
                    national, or international laws. This includes, but is not
                    limited to, counterfeit goods, weapons, drugs, stolen
                    property, and items that violate intellectual property
                    rights.
                </ListItem>
                <ListItem>
                    <strong>Fraudulent or Deceptive Practices:</strong> You are
                    not allowed to engage in fraudulent transactions, including
                    creating fake listings, misrepresenting goods, or attempting
                    to scam other users.
                </ListItem>
                <ListItem>
                    <strong>Money Laundering or Other Financial Crimes:</strong>{' '}
                    The use of the marketplace for money laundering or any
                    financial crime is strictly prohibited.
                </ListItem>
                <ListItem>
                    <strong>Unauthorized Use of Accounts:</strong> You may not
                    use another user’s account without their permission or
                    impersonate any person or entity in your interactions on the
                    platform.
                </ListItem>
                <ListItem>
                    <strong>Harmful Conduct:</strong> You may not engage in any
                    activity that could harm the marketplace, its users, or
                    disrupt the operation of the platform. This includes
                    attempting to hack, manipulate, or tamper with the
                    platform’s systems or security.
                </ListItem>
                <ListItem>
                    <strong>Violation of Local Laws:</strong> You must comply
                    with all local laws that apply to your use of the
                    marketplace, including any laws related to the buying and
                    selling of goods and the use of cryptocurrencies.
                </ListItem>
            </UnorderedList>
            <Text mb={4}>
                If we determine that you are engaging in any prohibited
                activities, we reserve the right to suspend or remove the
                listing, suspend or terminate your account, and take further
                legal action if necessary.
            </Text>
            <Text mb={4}>
                By using the platform, you agree to abide by these rules and
                understand that violating them could result in penalties,
                including the loss of access to the marketplace.
            </Text>
        </Flex>
    );
};

export default DisclaimerPolicy;
