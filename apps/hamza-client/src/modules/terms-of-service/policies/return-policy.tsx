import {
    ListItem,
    TabPanel,
    Text,
    UnorderedList,
    Flex,
} from '@chakra-ui/react';
import React from 'react';

const ReturnPolicy = ({ is_checkout = false }: { is_checkout?: boolean }) => {
    return is_checkout ? (
        <Flex
            flexDirection="column"
            fontSize={{ base: '14px', md: '16px' }}
            lineHeight={{ base: '1.6', md: '1.8' }}
            p={{ base: 4, md: 6 }}
            textAlign="left"
        >
            <ReturnContent />
        </Flex>
    ) : (
        <TabPanel
            fontSize={{ base: '14px', md: '16px' }}
            lineHeight={{ base: '1.6', md: '1.8' }}
            p={{ base: 4, md: 6 }}
            textAlign="left"
        >
            <ReturnContent />
        </TabPanel>
    );
};

export default ReturnPolicy;

const ReturnContent = () => (
    <>
        {/* Return Policy (Rules) */}
        <Text fontWeight="bold" fontSize={{ base: '18px', md: '20px' }} mb={4}>
            Return Policy
        </Text>
        <UnorderedList ml={8} mb={4}>
            <ListItem>No returns</ListItem>
            <ListItem>14-day buyer-paid returns</ListItem>
            <ListItem>14-day free returns</ListItem>
            <ListItem>30-day buyer-paid returns</ListItem>
            <ListItem>30-day free returns</ListItem>
        </UnorderedList>
        <Text mb={4}>
            Note: All returned items may be subject to full or partial refunds
            based on what the buyer and seller agree or what Hamza determines on
            a case-by-case manner.
        </Text>

        {/* Buyer and Seller Protection */}
        <Text fontWeight="bold" mb={4}>
            Buyer and Seller Protection
        </Text>
        <Text mb={4}>
            We strive to protect both buyers and sellers on our marketplace
            through the use of a smart contract escrow system, a defined
            inspection period, and clear processes for refunds and returns.
        </Text>

        {/* Escrow System */}
        <Text fontWeight="bold" mb={4}>
            1. Escrow System
        </Text>
        <Text mb={4}>
            Our platform uses a smart contract escrow system to ensure security
            for both buyers and sellers. When a buyer makes a payment, the funds
            are held in escrow by the smart contract. These funds are not
            released to the seller until the buyer confirms within the 7 day
            inspection period that they have received the goods and are
            satisfied with the purchase.
        </Text>
        <Text mb={4}>
            Sellers are protected by receiving the funds from the escrow as soon
            as the buyer confirms receipt of the goods or the inspection period
            has ended without a dispute.
        </Text>

        {/* Inspection Period */}
        <Text fontWeight="bold" mb={4}>
            2. Inspection Period
        </Text>
        <Text mb={4}>
            Buyers have an inspection period of <strong>seven (7) days</strong>{' '}
            from the date the item is marked as delivered to verify the goods
            they received. During this time, buyers should carefully inspect the
            items to ensure they match the listing description and are free from
            defects.
        </Text>
        <Text mb={4}>
            If an item has been lost in transit, arrives in defective condition,
            or if incorrect goods were shipped, the buyer must contact the
            seller directly explaining the issue. The seller will have{' '}
            <strong>48 hours</strong> to respond to the buyer.
        </Text>
        <Text mb={4}>
            If the seller does not respond within the 48-hour period, the buyer
            will receive a full refund, and the funds will be returned from
            escrow immediately.
        </Text>

        {/* Refunds and Returns */}
        <Text fontWeight="bold" mb={4}>
            3. Refunds and Returns
        </Text>
        <Text mb={4}>
            Buyers may request a refund from the seller under the following
            circumstances:
        </Text>
        <UnorderedList ml={8} mb={4}>
            <ListItem>The item never arrived.</ListItem>
            <ListItem>
                The item arrived after the estimated delivery date.
            </ListItem>
            <ListItem>The item arrived damaged.</ListItem>
            <ListItem>
                The item does not match the listing description.
            </ListItem>
            <ListItem>
                The seller offered a return without a specific reason.
            </ListItem>
            <ListItem>
                The request is within the 7-day Inspection period or as provided
                by applicable law, whichever is longer. Beyond this period,
                based on the Seller’s policy and applicable law, the Seller’s
                consent may be required.
            </ListItem>
        </UnorderedList>

        <Text mb={4}>
            There are <strong>three possible outcomes</strong> for a refund
            request:
        </Text>
        <UnorderedList ml={8} mb={4}>
            <ListItem>
                <strong>Seller Accepts the Request:</strong> If the seller
                accepts the refund request, the buyer will receive instructions
                from the seller on how to return the item. Depending on the
                terms agreed upon at the time of purchase:
                <UnorderedList ml={8} mt={2}>
                    <ListItem>
                        The seller will issue a refund after receiving and
                        inspecting the returned item.
                    </ListItem>
                    <ListItem>
                        The seller may issue a refund without requiring the item
                        to be returned.
                    </ListItem>
                    <ListItem>
                        A partial refund may be offered if the seller and buyer
                        agree to that outcome.
                    </ListItem>
                </UnorderedList>
            </ListItem>
            <ListItem>
                <strong>
                    Seller Does Not Respond Within the Given Time Frame:
                </strong>{' '}
                If the seller does not respond within <strong>48 hours</strong>,
                the buyer’s refund request will be automatically approved, and
                the funds will be refunded to the buyer’s wallet in the same
                cryptocurrency used for the purchase.
            </ListItem>
            <ListItem>
                <strong>Seller Disputes the Refund Request:</strong> If the
                seller disputes the refund request, either the buyer or seller
                can open a case. At this point, our platform's mediation team
                will step in to mediate the situation. Hamza may request
                additional evidence from both the buyer and the seller, such as
                photos of the item, proof of delivery, or communication records,
                in order to come to a fair resolution. The decision made by
                Hamza will be final and binding.
            </ListItem>
        </UnorderedList>
    </>
);
