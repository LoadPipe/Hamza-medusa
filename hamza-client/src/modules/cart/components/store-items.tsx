import { Box, Text, HStack, Image as ChakraImage } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import Item from '@modules/cart/components/item';
import { CartWithCheckoutStep } from '@/types/global';

type StoreItemsProps = {
    store: {
        id: string;
        name: string;
        icon: string;
        items: any[];
    };
    cart: CartWithCheckoutStep;
    currencyCode?: string;
};

const StoreItems = ({ store, cart }: StoreItemsProps) => {
    return (
        <Box key={store.id} my={12} pt={6} borderTop="1px solid #3E3E3E">
            <Box>
                <HStack>
                    <ChakraImage
                        src={store.icon}
                        alt="Light Logo"
                        boxSize={{ base: '32px' }}
                        borderRadius="full"
                    />
                    <Text fontWeight={600} color="white">
                        {store.name}
                    </Text>
                    <FaCheckCircle color="#3196DF" />
                </HStack>
            </Box>
            <Box>
                {store.items.map((item) => (
                    <Item key={item.id} item={item} />
                ))}
            </Box>
            {cart.discounts?.some(
                (discount) => discount.store_id === store.id
            ) && (
                <Box>
                    <Box
                        px={3}
                        py={2}
                        backgroundColor="#242424"
                        display={'inline-block'}
                        borderRadius={'10px'}
                        color="white"
                    >
                        Discount applied:{' '}
                        {cart.discounts
                            .filter(
                                (discount) => discount.store_id === store.id
                            )
                            .map((discount) => discount.code)
                            .join(',')}
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default StoreItems;
