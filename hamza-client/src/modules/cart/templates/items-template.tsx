import { Box, Flex, Text } from '@chakra-ui/react';
import { organizeCartItemsByStore } from '@/app/[countryCode]/(main)/cart/utils/fetch-cart-for-cart';
import React from 'react';
import { CartWithCheckoutStep } from '@/types/global';
import EmptyCart from '@modules/cart/components/empty-cart';
import StoreItems from '@modules/cart/components/store-items';

type ItemsTemplateProps = {
    currencyCode?: string;
    cart: CartWithCheckoutStep;
};

const ItemsTemplate = ({ currencyCode, cart }: ItemsTemplateProps) => {
    // refactor organization of store with items
    const stores = organizeCartItemsByStore(cart as CartWithCheckoutStep);

    return (
        <Flex
            flexDir={'column'}
            maxW={cart?.items && cart?.items.length > 0 ? '830px' : '100%'}
            width={'100%'}
            height={'auto'}
            alignSelf={'self-start'}
            py={{ base: '16px', md: '40px' }}
            px={{ base: '16px', md: '45px' }}
            borderRadius={'16px'}
            backgroundColor={'#121212'}
            color={'white'}
        >
            <Flex justifyContent={{ base: 'center', md: 'left' }}>
                {/* <Radio mr="2rem" display={{ base: 'none', md: 'flex' }} /> */}
                <Text
                    fontWeight={600}
                    fontSize={{ base: '16px', md: '18px' }}
                    color="primary.green.900"
                >
                    Product Details
                </Text>
            </Flex>
            <Box mt="1rem" minHeight={{ base: '170px', md: '400px' }}>
                {cart?.items && cart?.items.length > 0 && cart?.region ? (
                    <>
                        {stores.map((store) => (
                            <StoreItems
                                key={store.id}
                                store={store}
                                cart={cart}
                                currencyCode={currencyCode}
                            />
                        ))}
                    </>
                ) : (
                    <EmptyCart />
                )}
            </Box>
        </Flex>
    );
};

export default ItemsTemplate;
