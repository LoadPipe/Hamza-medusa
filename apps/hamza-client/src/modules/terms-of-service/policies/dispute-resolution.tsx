import { Flex, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import React from 'react';

const DisputeResolution = () => {
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
                Dispute Resolution
            </Text>
            <Text mb={4}>
                We aim to provide a fair and efficient dispute resolution
                process for all transactions conducted on our marketplace.
                Disputes between buyers and sellers may be resolved either
                through the smart contract’s automated mechanisms or by
                mediation and/or arbitration as outlined below.
            </Text>

            {/* Smart Contract-Based Dispute Mechanism */}
            <Text fontWeight="bold" mb={4}>
                1. Smart Contract-Based Dispute Mechanism
            </Text>
            <Text mb={4}>
                In the event of a dispute between a buyer and a seller, the
                smart contract may automatically resolve the issue based on
                predefined terms:
            </Text>
            <UnorderedList ml={8} mb={4}>
                <ListItem>
                    <strong>Automated Refund</strong>: If the goods are not
                    delivered by a specified date, the smart contract will
                    automatically release the funds back to the buyer.
                </ListItem>
                <ListItem>
                    <strong>Automated Return</strong>: Based on the return rule
                    chosen by the buyer, the smart contract may initiate a
                    return and issue the appropriate refund or partial refund
                    according to the agreed terms.
                </ListItem>
            </UnorderedList>
            <Text mb={4}>
                These automated processes are designed to minimize disputes;
                however, if a dispute arises that the smart contract cannot
                address (e.g., regarding the quality or condition of goods,
                etc), further steps will be taken.
            </Text>

            {/* Hamza’s Arbitration System */}
            <Text fontWeight="bold" mb={4}>
                2. Hamza’s Arbitration System
            </Text>
            <Text mb={4}>
                For disputes that cannot be automatically resolved by the smart
                contract, such as disagreements over the quality of goods, the
                platform will act as an arbitrator. In these cases:
            </Text>
            <UnorderedList ml={8} mb={4}>
                <ListItem>
                    The platform will conduct an{' '}
                    <strong>internal review</strong> of the dispute, including
                    any evidence submitted by both the buyer and the seller
                    (e.g., photos, proof of delivery, communications).
                </ListItem>
                <ListItem>
                    After reviewing the details of the case, the platform will
                    make a final decision, which both the buyer and seller agree
                    to accept as binding.
                </ListItem>
                <ListItem>
                    The platform’s decision will be considered final and
                    non-appealable within the platform's internal process.
                </ListItem>
            </UnorderedList>

            {/* Legal Jurisdiction and Arbitration */}
            <Text fontWeight="bold" mb={4}>
                3. Legal Jurisdiction and Arbitration
            </Text>
            <Text mb={4}>
                If a dispute cannot be resolved through the platform’s internal
                arbitration mechanisms or if it concerns the interpretation,
                application, performance, or termination of the platform’s
                agreements, the following legal process will apply:
            </Text>
            <UnorderedList ml={8} mb={4}>
                <ListItem>
                    Any unresolved disputes will be referred to{' '}
                    <strong>Arbitration</strong>, following an attempt at{' '}
                    <strong>Conciliation</strong>, administered by the
                    <strong> Panama Conciliation and Arbitration Centre</strong>
                    .
                </ListItem>
                <ListItem>
                    Arbitration will be conducted in accordance with the
                    procedural rules of the Panama Conciliation and Arbitration
                    Centre.
                </ListItem>
                <ListItem>
                    The arbitration will take place in{' '}
                    <strong>Panama City</strong>, Panama, and the arbitrator's
                    decision will be final and binding for both parties.
                </ListItem>
                <ListItem>
                    In the event of a dispute requiring arbitration, both
                    parties agree to equally share the administrative costs and
                    arbitrator fees. Each party will be responsible for their
                    own legal expenses, including representation, preparation,
                    and any travel costs.
                </ListItem>
            </UnorderedList>
            <Text mb={4}>
                By using our marketplace, both buyers and sellers agree to this
                dispute resolution process and waive the right to pursue class
                action lawsuits where applicable.
            </Text>
        </Flex>
    );
};

export default DisputeResolution;
