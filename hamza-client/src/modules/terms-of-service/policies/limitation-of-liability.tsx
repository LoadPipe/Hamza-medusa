import { Flex, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import React from 'react';

const LimitationOfLiability = () => {
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
                Limitation of Liability
            </Text>

            {/* Platform’s Liability */}
            <Text fontWeight="bold" mb={4}>
                1. Platform’s Liability
            </Text>
            <Text mb={4}>
                The marketplace is not responsible for any disputes, damages, or
                losses that arise from interactions between buyers and sellers.
                We do not control or guarantee the quality, safety, legality, or
                delivery of the goods listed for sale, nor do we endorse any
                user’s conduct.
            </Text>
            <Text mb={4}>
                In addition, the marketplace is not liable for any losses due to
                cryptocurrency price volatility. The value of cryptocurrency can
                fluctuate, and it is the responsibility of both buyers and
                sellers to understand and accept these risks when conducting
                transactions on the platform.
            </Text>
            <Text mb={4}>
                We are also not responsible for any technical issues related to
                the smart contracts used in transactions. While smart contracts
                automate the escrow and fund release process, unforeseen
                technical issues may occur, and the marketplace cannot be held
                liable for any resulting losses.
            </Text>

            {/* Liability Caps */}
            <Text fontWeight="bold" mb={4}>
                2. Liability Caps
            </Text>
            <Text mb={4}>
                In the event that the platform is found liable for any claim,
                the liability of the marketplace will be limited to the greater
                of:
            </Text>
            <UnorderedList ml={8} mb={4}>
                <ListItem>The value of the transaction in dispute, or</ListItem>
                <ListItem>
                    The total fees paid to the platform by the affected party in
                    connection with the disputed transaction.
                </ListItem>
            </UnorderedList>
            <Text mb={4}>
                This means that our liability will not exceed the transaction
                amount or the fees paid, whichever is higher.
            </Text>
            <Text mb={4}>
                <strong>Total Liability:</strong> In no event shall the
                Platform’s total liability to any user for all claims related to
                transactions or use of the Platform exceed the amount of fees
                paid to the Platform by the user in the previous 12 months, or
                $100 USDT/USDC, whichever is greater.
            </Text>

            {/* Exclusions of Warranty */}
            <Text fontWeight="bold" mb={4}>
                3. Exclusions of Warranty
            </Text>
            <Text mb={4}>
                The marketplace provides its services on an “as-is” and
                “as-available” basis, and we make no warranties of any kind. We
                do not provide any warranties regarding:
            </Text>
            <UnorderedList ml={8} mb={4}>
                <ListItem>
                    The goods sold by sellers on the platform, including their
                    quality, condition, or compliance with any descriptions or
                    laws.
                </ListItem>
                <ListItem>
                    The performance, security, or uninterrupted functionality of
                    the smart contracts used in transactions.
                </ListItem>
                <ListItem>
                    The use or value of cryptocurrencies on the platform.
                </ListItem>
            </UnorderedList>
            <Text mb={4}>
                We are simply an intermediary that facilitates transactions
                between buyers and sellers, and we do not assume any
                responsibility for the actions of users or the goods sold on the
                platform.
            </Text>
            <Text mb={4}>
                By using our marketplace, you agree to these limitations and
                acknowledge that the marketplace cannot be held responsible for
                any indirect, incidental, or consequential damages arising from
                the use of the platform.
            </Text>

            {/* Force Majeure */}
            <Text fontWeight="bold" mb={4}>
                4. Force Majeure
            </Text>
            <Text mb={4}>
                Neither the Platform nor any buyer or seller shall be held
                liable for any failure or delay in performance under these Terms
                of Service when such failure or delay results from events beyond
                their reasonable control ("Force Majeure"). Force Majeure events
                include, but are not limited to, natural disasters, war, civil
                unrest, strikes, government actions, pandemics, interruptions of
                internet service or blockchain networks, or other unforeseen
                circumstances that prevent the performance of obligations under
                these Terms.
            </Text>
            <Text mb={4}>
                During the duration of a Force Majeure event, all affected
                obligations will be suspended. If the Force Majeure event
                continues for more than 30 days, either party may terminate the
                affected transaction without penalty.
            </Text>
        </Flex>
    );
};

export default LimitationOfLiability;
