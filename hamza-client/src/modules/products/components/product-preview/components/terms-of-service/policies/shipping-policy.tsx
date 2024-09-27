import { TabPanel, Text } from '@chakra-ui/react';
import React from 'react';

const ShippingpPolicy = () => {
    return (
        <TabPanel>
            <Text fontWeight="bold">1. Shipping Options</Text>
            <Text mt={2}>
                At Hamza, sellers offer a variety of shipping options to suit
                your needs:
            </Text>
            <Text mt={2} ml={4}>
                • <strong>Standard Shipping:</strong> Estimated delivery time
                ranges between 3-7 business days.
            </Text>
            <Text mt={2} ml={4}>
                • <strong>Express Shipping:</strong> For faster delivery,
                estimated between 1-3 business days.
            </Text>
            <Text mt={2} ml={4}>
                • <strong>International Shipping:</strong> Available for certain
                products and sellers. Delivery times vary depending on the
                destination country.
            </Text>
            <Text mt={2}>
                Delivery times may vary based on the seller’s location, shipping
                carrier, and product availability.
            </Text>

            <Text fontWeight="bold" mt={4}>
                2. Shipping Costs
            </Text>
            <Text mt={2}>
                • Shipping costs are calculated based on the weight, size, and
                destination of the items. Sellers may offer free shipping
                promotions from time to time.
            </Text>
            <Text mt={2}>
                • The total shipping cost will be displayed at checkout before
                you complete your purchase.
            </Text>

            <Text fontWeight="bold" mt={4}>
                3. Order Processing Time
            </Text>
            <Text mt={2}>
                • Sellers typically process and dispatch orders within 1-3
                business days after purchase confirmation.
            </Text>
            <Text mt={2}>
                • Buyers will receive a notification with a tracking number (if
                applicable) once the order has been shipped.
            </Text>

            <Text fontWeight="bold" mt={4}>
                4. Tracking Your Order
            </Text>
            <Text mt={2}>
                • Once your order is shipped, you will receive a tracking link
                via email or within your Hamza account, allowing you to track
                your order in real-time.
            </Text>

            <Text fontWeight="bold" mt={4}>
                5. Shipping Restrictions
            </Text>
            <Text mt={2}>
                • Some products may have shipping restrictions due to local
                regulations or shipping carrier limitations. These restrictions
                will be noted on the product page.
            </Text>
            <Text mt={2}>
                • Certain items may not be eligible for international shipping,
                or may require additional customs fees or import duties, which
                are the buyer’s responsibility.
            </Text>

            <Text fontWeight="bold" mt={4}>
                6. Lost or Delayed Shipments
            </Text>
            <Text mt={2}>
                • In the event of lost or delayed shipments, buyers are
                encouraged to contact the seller directly. If a resolution
                cannot be reached, Hamza’s customer support team can assist in
                mediating the issue.
            </Text>
            <Text mt={2}>
                • Shipping delays caused by unforeseen circumstances (natural
                disasters, customs delays, etc.) are beyond Hamza’s control.
            </Text>
        </TabPanel>
    );
};

export default ShippingpPolicy;
