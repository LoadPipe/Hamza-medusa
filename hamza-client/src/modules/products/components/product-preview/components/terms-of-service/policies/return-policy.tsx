import { TabPanel, Text } from '@chakra-ui/react';
import React from 'react';

const ReturnPolicy = () => {
    return (
        <TabPanel>
            <Text fontWeight="bold">Returns and Refunds</Text>

            <Text mt={4} fontWeight="bold">
                1. Return Eligibility
            </Text>
            <Text mt={2}>
                • Most items purchased on Hamza can be returned within 30 days
                of delivery, provided they are in original condition, unused,
                and in the original packaging.
            </Text>
            <Text mt={2}>
                • Certain items, such as digital products, perishable goods, or
                customized products, may not be eligible for return. These
                exceptions will be indicated on the product page.
            </Text>

            <Text mt={4} fontWeight="bold">
                2. How to Initiate a Return
            </Text>
            <Text mt={2}>
                • Contact the seller directly through the Hamza platform within
                the 30-day return window.
            </Text>
            <Text mt={2}>
                • Provide the order number, reason for return, and any relevant
                photos or documentation.
            </Text>
            <Text mt={2}>
                • The seller will provide further instructions on how to return
                the item, including the return address and shipping method.
            </Text>

            <Text mt={4} fontWeight="bold">
                3. Return Shipping Costs
            </Text>
            <Text mt={2}>
                • Buyers are responsible for covering the return shipping costs
                unless the item was damaged, defective, or incorrectly
                delivered.
            </Text>
            <Text mt={2}>
                • If the return is due to an error on the seller’s part, such as
                sending the wrong item or a damaged product, the seller will
                typically cover the return shipping costs.
            </Text>

            <Text mt={4} fontWeight="bold">
                4. Refund Process
            </Text>
            <Text mt={2}>
                • Once the seller receives and inspects the returned item, a
                refund will be issued in the original form of payment or as
                store credit within 5-7 business days.
            </Text>
            <Text mt={2}>
                • For payments made with cryptocurrency, the refund will be
                processed based on the market value of the cryptocurrency at the
                time of purchase or as agreed upon by the buyer and seller.
            </Text>
            <Text mt={2}>
                • Buyers will receive a notification once the refund is
                processed.
            </Text>

            <Text mt={4} fontWeight="bold">
                5. Non-Refundable Items
            </Text>
            <Text mt={2}>
                • Items marked as final sale or non-returnable (such as digital
                products, perishable goods, or personalized items) cannot be
                returned or refunded unless they arrive damaged or defective.
            </Text>

            <Text mt={4} fontWeight="bold">
                6. Damaged or Defective Items
            </Text>
            <Text mt={2}>
                • If you receive an item that is damaged, defective, or not as
                described, contact the seller within 7 days of receiving the
                product to report the issue.
            </Text>
            <Text mt={2}>
                • Provide clear photos of the damage or defect to facilitate the
                return process. The seller will work with you to resolve the
                issue, either by offering a replacement, refund, or other
                solution.
            </Text>
        </TabPanel>
    );
};

export default ReturnPolicy;
