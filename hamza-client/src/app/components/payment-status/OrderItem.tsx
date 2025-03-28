import {
    Box,
    HStack,
    Icon,
    Text,
    Collapse,
    VStack,
    Flex,
} from '@chakra-ui/react';
import { FaBox } from 'react-icons/fa';
import Image from 'next/image';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { formatCryptoPrice } from '@/lib/util/get-product-price';
import { LineItem } from '@/app/[countryCode]/(main)/order/processing/[id]/page';
import OrderItemDetails from './OrderItemDetails';

interface OrderItemProps {
    order: any; // Replace with proper type
    isOpen: boolean;
    onToggle: () => void;
    currencyCode: string;
}

const OrderItem = ({
    order,
    isOpen,
    onToggle,
    currencyCode,
}: OrderItemProps) => {
    return (
        <Box
            bg="gray.800"
            p={4}
            borderRadius="lg"
            cursor="pointer"
            onClick={onToggle}
        >
            <HStack justify="space-between">
                <HStack spacing={3}>
                    <Icon as={FaBox} color="white" />
                    <Text color="white">
                        {order.id} - {order.store.name}
                    </Text>
                </HStack>
                <Flex>
                    <Image
                        className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                        src={currencyIcons[currencyCode ?? 'usdc']}
                        alt={currencyCode ?? 'usdc'}
                    />
                    <Text ml="0.4rem" color="white">
                        {formatCryptoPrice(
                            order.payments[0].amount,
                            order.currency_code
                        )}
                    </Text>
                </Flex>
            </HStack>

            <Collapse in={isOpen}>
                {order.detail && (
                    <Box mt={4} pl={8}>
                        {order.detail.items.map((item: LineItem) => (
                            <OrderItemDetails
                                key={item.id}
                                item={item}
                                storeName={order.store.name}
                                storeIcon={order.store.icon}
                            />
                        ))}
                    </Box>
                )}
            </Collapse>
        </Box>
    );
};

export default OrderItem;
