import { Box, HStack, VStack, Text, Flex } from '@chakra-ui/react';
import Image from 'next/image';
import currencyIcons from '@/images/currencies/crypto-currencies';
import { formatCryptoPrice } from '@/lib/util/get-product-price';
import { LineItem } from '@/app/[countryCode]/(main)/order/processing/[id]/page';

interface OrderItemDetailsProps {
    item: LineItem;
    storeName: string;
    storeIcon: string;
    isLastItem: boolean;
}

const OrderItemDetails = ({
    item,
    storeName,
    storeIcon,
    isLastItem,
}: OrderItemDetailsProps) => {
    return (
        <HStack
            key={item.id}
            pt={8}
            pb={isLastItem ? 0 : 8}
            justify="space-between"
            width="100%"
            spacing={4}
            borderBottom={isLastItem ? 'none' : '1px solid'}
            borderColor="gray.700"
        >
            <Box flex="1">
                <HStack>
                    <Image
                        className="rounded-md"
                        src={item.thumbnail ?? '/placeholder-image.png'}
                        alt={item.title}
                        style={{
                            width: '50px',
                            height: '50px',
                        }}
                        height={50}
                        width={50}
                    />
                    <VStack alignItems="flex-start" gap={0}>
                        <Text color="white" noOfLines={1}>
                            {item.title}
                        </Text>
                        <Text color="gray.500" fontSize="sm" noOfLines={1}>
                            {item.variant.title}
                        </Text>
                    </VStack>
                </HStack>
            </Box>
            <Box width="200px" flexShrink={0}>
                <VStack alignItems="flex-start" gap={0}>
                    <Text color="gray.500">Sold by:</Text>
                    <HStack>
                        <Image
                            className="rounded-2xl"
                            src={storeIcon}
                            alt={storeName}
                            style={{
                                width: '25px',
                                height: '25px',
                            }}
                            height={25}
                            width={25}
                        />
                        <Text color="white" noOfLines={1}>
                            {storeName}
                        </Text>
                    </HStack>
                </VStack>
            </Box>
            <Box width="150px" flexShrink={0}>
                <VStack alignItems="flex-end" gap={0}>
                    <Text color="gray.500">Amount:</Text>
                    <Flex>
                        <Image
                            className="h-[14px] w-[14px] md:h-[18px] md:w-[18px] self-center"
                            src={currencyIcons[item.currency_code ?? 'usdc']}
                            alt={item.currency_code ?? 'usdc'}
                        />
                        <Text ml="0.4rem" color="white">
                            {formatCryptoPrice(
                                item.total ?? 0,
                                item.currency_code
                            )}
                        </Text>
                    </Flex>
                </VStack>
            </Box>
        </HStack>
    );
};

export default OrderItemDetails;
