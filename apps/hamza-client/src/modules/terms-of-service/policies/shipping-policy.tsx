import {
    Flex,
    Text,
    UnorderedList,
    ListItem,
    TabPanel,
} from '@chakra-ui/react';
import React from 'react';

const ShippingPolicy = ({ is_checkout = false }: { is_checkout?: boolean }) => {
    return is_checkout ? (
        <Flex
            flexDirection="column"
            fontSize={{ base: '14px', md: '16px' }}
            lineHeight={{ base: '1.6', md: '1.8' }}
            p={{ base: 4, md: 6 }}
            textAlign="left"
        >
            <ShippingContent />
        </Flex>
    ) : (
        <TabPanel
            fontSize={{ base: '14px', md: '16px' }}
            lineHeight={{ base: '1.6', md: '1.8' }}
            p={{ base: 4, md: 6 }}
            textAlign="left"
        >
            <ShippingContent />
        </TabPanel>
    );
};

export default ShippingPolicy;

const ShippingContent = () => (
    <>
        {/* Header */}
        <Text fontWeight="bold" fontSize={{ base: '18px', md: '20px' }} mb={4}>
            Shipping & Delivery
        </Text>
        <Text mb={4}>
            Sellers on Hamza marketplace are responsible for packaging and
            shipping the goods to buyers. Even in the case of using a shipping
            or fulfillment service, sellers are ultimately responsible for
            buyers receiving their orders.
        </Text>
        <Text mb={4}>
            Whenever possible, Sellers shall provide various shipping options
            for buyers to choose from during the checkout process as well as
            their return policy. Options may include standard, expedited, or
            international shipping, depending on the seller's location and the
            buyer's preferences. Buyers are encouraged to review these policies
            carefully before making a purchase. The following terms outline key
            considerations regarding shipping and delivery, especially for
            international transactions.
        </Text>

        {/* Shipping Options */}
        <Text fontWeight="bold" mb={4}>
            1. Shipping Options
        </Text>
        <Text mb={4}>
            Sellers will list the available shipping methods, estimated delivery
            times, and costs for each option. Buyers are responsible for
            selecting their preferred shipping method at checkout. The final
            shipping cost will be calculated based on the shipping option
            selected and the destination of the goods.
        </Text>

        {/* International Shipping */}
        <Text fontWeight="bold" mb={4}>
            2. International Shipping
        </Text>
        <Text mb={4}>
            If shipping goods across borders, sellers must comply with
            international shipping regulations and ensure that the item can
            legally be shipped to the buyer's country. Depending on the shipping
            option chosen by buyers, they may be responsible for any additional
            fees that may arise from customs duties, import taxes, or other
            charges related to international shipments. Please ensure you
            understand shipping options before you choose to avoid unpleasant
            surprises.
        </Text>

        {/* Tracking and Delivery */}
        <Text fontWeight="bold" mb={4}>
            3. Tracking and Delivery
        </Text>
        <Text mb={4}>
            Sellers will provide a valid tracking number for all shipments,
            where available. Buyers can use this tracking information to monitor
            the delivery status of their order. Hamza recommends that sellers
            use reliable carriers with tracking capabilities, especially for
            high-value items.
        </Text>

        {/* Delivery Timeframes */}
        <Text fontWeight="bold" mb={4}>
            4. Delivery Timeframes
        </Text>
        <Text mb={4}>
            Delivery times are estimates and depend on the shipping method
            selected. Delays may occur due to customs processing, holidays, or
            other unforeseen circumstances outside of the Seller or Platform’s
            control. Buyers should account for possible delays when selecting a
            shipping method.
        </Text>

        {/* Buyer Responsibility */}
        <Text fontWeight="bold" mb={4}>
            5. Buyer Responsibility
        </Text>
        <Text mb={4}>
            Once the item has been shipped, buyers are responsible for ensuring
            they are available to receive the delivery. If a shipment is
            returned due to incorrect address information provided by the buyer,
            additional shipping costs may apply to re-ship the item.
            Additionally, it’s the Buyer’s responsibility to ensure the goods
            they are purchasing can be legally imported into their country. If
            an item is seized by customs due to local laws, the Platform and the
            seller will not be held responsible for the loss or any additional
            charges that arise.
        </Text>

        {/* Lost or Damaged Goods */}
        <Text fontWeight="bold" mb={4}>
            6. Lost or Damaged Goods
        </Text>
        <Text mb={4}>
            If an item is lost or damaged during shipping, depending on the
            shipping term selected, the seller may be responsible for filing a
            claim with the shipping carrier. Buyers should notify the seller
            immediately if their item does not arrive or arrives damaged. See
            section below on how and when to file a claim for a lost or damaged
            item.
        </Text>
        <Text fontStyle="italic" mb={4}>
            See Section 7 Buyer and Seller Protection (below) for Refunds and
            Returns Policy.
        </Text>
    </>
);
