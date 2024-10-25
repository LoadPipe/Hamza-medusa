import { Flex, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import React from 'react';

const ComplianceWithCryptoRegulations = () => {
    return (
        <Flex
            flexDirection="column"
            fontSize={{ base: '14px', md: '16px' }}
            lineHeight={{ base: '1.6', md: '1.8' }}
            p={{ base: 4, md: 6 }}
            textAlign="left"
        >
            {/* Header */}
            <Text
                fontWeight="bold"
                fontSize={{ base: '18px', md: '20px' }}
                mb={4}
            >
                Compliance with Cryptocurrency Regulations
            </Text>
            <Text mb={4}>
                Our marketplace follows cryptocurrency regulations to ensure a
                secure and lawful platform. We comply with Know Your Customer
                (KYC) and Anti-Money Laundering (AML) rules, and users from
                certain countries may be restricted from using the platform due
                to local laws.
            </Text>

            {/* KYC/AML/CTF Compliance */}
            {/* Header */}

            <Text
                fontSize={{ base: '18px', md: '20px' }}
                fontWeight="bold"
                mb={4}
            >
                KYC/AML/CTF Compliance
            </Text>
            <Text mb={4}>
                Depending on the laws in your country, we may need to collect
                additional personal information to verify your identity and
                prevent illegal activities such as money laundering and
                terrorism. This is known as{' '}
                <strong>Know Your Customer (KYC)</strong>,{' '}
                <strong>Anti-Money Laundering (AML)</strong>, and{' '}
                <strong>Counter-Terrorism Financing (CTF)</strong> compliance.
            </Text>
            <Text mb={4}>If required by law, we may ask you to provide:</Text>
            <UnorderedList ml={8} mb={4}>
                <ListItem>A government-issued ID</ListItem>
                <ListItem>Proof of address</ListItem>
                <ListItem>
                    Other personal details to verify your identity
                </ListItem>
            </UnorderedList>
            <Text mb={4}>
                Your information will be handled securely and only used for
                compliance purposes. It will not be shared or sold to third
                parties, nor utilized for marketing purposes.
            </Text>
            <Text mb={4}>
                The Platform reserves the right to restrict or terminate any
                user account that fails to comply with AML/CTF requirements or
                is suspected of involvement in illicit activities, including
                money laundering, terrorist financing, or other financial
                crimes. The Platform may also report suspicious activity to the
                relevant regulatory authorities in accordance with applicable
                laws.
            </Text>
        </Flex>
    );
};

export default ComplianceWithCryptoRegulations;
