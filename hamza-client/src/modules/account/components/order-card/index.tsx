import Thumbnail from '@modules/products/components/thumbnail';
import { formatAmount } from '@lib/util/prices';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { ExternalLinkIcon } from '@chakra-ui/icons';

import {
    Box,
    Flex,
    Text,
    Button,
    Image,
    Link,
    useColorModeValue,
} from '@chakra-ui/react';
// Update the type definitions to reflect the structure of the received order
type OrderDetails = {
    thumbnail: string;
    title: string;
    description: string;
};

type Order = {
    id: string;
    display_id: string;
    created_at: string;
    details: OrderDetails;
    quantity: string;
    paid_total: number;
    currency_code: string;
    unit_price: number;
    thumbnail: string;
    title: string;
    description: string;
    region: {
        id: string;
        name: string;
    };
};

type OrderCardProps = {
    order: Order;
    handle: any;
};

const OrderCard = ({ order, handle }: OrderCardProps) => {
    if (!order) {
        return <div>Loading...</div>; // Display loading message if order is undefined
    }
    const textColor = useColorModeValue('gray.800', 'white');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    // console.log(`Order Card information is: ${JSON.stringify(order)}`);
    const orderString = typeof order.currency_code;
    // console.log(
    //     `Order Unit Price ${order.unit_price} and Currency Code ${order.currency_code} ${orderString}`
    // );
    console.log(`Order Card details ${JSON.stringify(order)}`);
    console.log(`Product details ${JSON.stringify(handle)} `);

    return (
        <Box
            bg={useColorModeValue('white', 'gray.800')}
            p={5}
            rounded="lg"
            shadow="base"
        >
            <Flex alignItems="center" justifyContent="space-between">
                <Box flexShrink={0}>
                    <Image
                        borderRadius="lg"
                        width={{ base: 24, md: 48 }}
                        src={order.thumbnail}
                        alt={`Thumbnail of ${order.title}`}
                    />
                </Box>
                <Box flex="1" ml={5}>
                    <Text fontWeight="bold" fontSize="lg" color={textColor}>
                        {order.title}
                    </Text>
                    <Text fontSize="sm" color={textColor}>
                        {order.description}
                    </Text>
                    <Flex align="center" mt={2}>
                        <Text
                            fontSize="sm"
                            color={textColor}
                            pr={2}
                            borderRight="1px"
                            borderColor={borderColor}
                        >
                            {new Date(order.created_at).toLocaleDateString()}
                        </Text>
                        <Text fontSize="sm" color={textColor} px={2}>
                            {order.unit_price} {order.currency_code}
                        </Text>
                        <Text fontSize="sm" color={textColor} pl={2}>
                            {order.quantity} items
                        </Text>
                    </Flex>
                </Box>
                <Flex alignItems="center">
                    <Button colorScheme="blue" mr={2}>
                        Buy Again
                    </Button>
                    <Link href={`/contact-seller/${order.id}`} isExternal>
                        Contact Seller <ExternalLinkIcon mx="2px" />
                    </Link>
                </Flex>
            </Flex>
        </Box>
    );
};

export default OrderCard;
