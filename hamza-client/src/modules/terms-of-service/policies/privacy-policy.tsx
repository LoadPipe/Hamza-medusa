import {
    Flex,
    Text,
    UnorderedList,
    ListItem,
    TabPanel,
} from '@chakra-ui/react';
import React from 'react';

const PrivacyPolicy = ({ is_checkout = false }: { is_checkout?: boolean }) => {
    return is_checkout ? (
        <Flex
            flexDirection="column"
            fontSize={{ base: '14px', md: '16px' }}
            lineHeight={{ base: '1.6', md: '1.8' }}
            p={{ base: 4, md: 6 }}
            textAlign="left"
        >
            <PrivacyContent />
        </Flex>
    ) : (
        <TabPanel
            fontSize={{ base: '14px', md: '16px' }}
            lineHeight={{ base: '1.6', md: '1.8' }}
            p={{ base: 4, md: 6 }}
            textAlign="left"
        >
            <PrivacyContent />
        </TabPanel>
    );
};

const PrivacyContent = () => (
    <>
        {/* Header */}
        <Text fontWeight="bold" fontSize={{ base: '18px', md: '20px' }} mb={4}>
            Privacy Policy
        </Text>
        <Text mb={4}>
            We value your privacy and want to be clear about the information we
            collect, how it’s used, and what protections we offer. By using our
            platform, you agree to the terms of this Privacy Policy.
        </Text>

        {/* Data Collection */}
        <Text fontWeight="bold" mb={4}>
            1. Data Collection for Know Your Client (KYC), Shipping, and
            Communication Purposes
        </Text>
        <Text mb={4}>
            When you use our marketplace, we collect certain information to
            ensure smooth transactions and communication between buyers and
            sellers. Here’s what we collect and how it’s used:
        </Text>
        <UnorderedList ml={8} mb={4}>
            <ListItem>
                <strong>Email Address (Required)</strong>: We collect your email
                address to create your account, send important updates, and
                provide customer support.
            </ListItem>
            <ListItem>
                <strong>First Name/Last Name (Optional)</strong>: You may choose
                to provide your first and last name, but this is optional and
                not required for account creation.
            </ListItem>
            <ListItem>
                <strong>Shipping Address (Required)</strong>: To facilitate the
                delivery of goods purchased through our platform, we require
                your shipping address. This information will be shared only with
                the seller when necessary for completing your transaction.
            </ListItem>
            <ListItem>
                <strong>Wallet Address (Required)</strong>: We collect your
                cryptocurrency wallet address to facilitate transactions on the
                platform. This information is used for payments and to record
                transaction metadata, but we do not store private keys.
            </ListItem>
            <ListItem>
                <strong>Preferred Currency</strong>: You can set your preferred
                cryptocurrency for making and receiving payments.
            </ListItem>
        </UnorderedList>
        <Text mb={4}>
            All personal data collected is securely stored on{' '}
            <strong>AWS servers</strong>, and we take reasonable measures to
            protect your information from unauthorized access, loss, or misuse.
        </Text>

        {/* Blockchain Transparency */}
        <Text fontWeight="bold" mb={4}>
            2. Blockchain Transparency
        </Text>
        <Text mb={4}>
            While we protect your personal data, please understand that{' '}
            <strong>cryptocurrency transactions are publicly visible</strong> on
            the blockchain. This means that while we don’t publicly share your
            personal information, details about your cryptocurrency transactions
            (such as wallet addresses and amounts) are visible on the blockchain
            and cannot be removed or altered.
        </Text>
        <Text mb={4}>
            It’s important to note that blockchain technology operates outside
            the platform’s control, so any actions or transactions you make
            using cryptocurrency are inherently transparent and may be
            traceable.
        </Text>

        {/* Third-Party Services */}
        <Text fontWeight="bold" mb={4}>
            3. Third-Party Services
        </Text>
        <Text mb={4}>
            In some cases, we may use third-party services for additional
            features, such as{' '}
            <strong>KYC (Know Your Customer) verification</strong> if required
            by certain jurisdictions, or to integrate with cryptocurrency
            exchanges.
        </Text>
        <Text mb={4}>
            If you are required to complete KYC verification, we may need to
            collect more personal information, such as your government-issued ID
            or proof of address, depending on your region or the product/service
            you are using on our platform. These third-party providers are
            responsible for handling this data securely and in compliance with
            local regulations.
        </Text>
        <Text mb={4}>
            We make every effort to protect your personal data and ensure that
            we comply with all applicable privacy regulations. However, the use
            of third-party services may be subject to their own privacy
            policies, and we encourage you to review those as needed.
        </Text>

        {/* Your Privacy and Security */}
        <Text fontWeight="bold" mb={4}>
            4. Your Privacy and Security
        </Text>
        <Text mb={4}>
            We take your privacy seriously and strive to protect your
            information to the best of our ability. However, it is important to
            note that no system is completely secure, and we cannot guarantee
            the absolute security of your data. You should take precautions to
            safeguard your account, including protecting your private
            cryptocurrency keys and using strong passwords.
        </Text>
        <Text mb={4}>
            By using our platform, you acknowledge that you understand and agree
            to this Privacy Policy, and you accept the inherent transparency of
            blockchain-based transactions.
        </Text>
        <Text mb={4}>
            If you have any questions or concerns about your privacy, please
            contact us at [support email].
        </Text>
    </>
);

export default PrivacyPolicy;
