import { Flex, Text } from '@chakra-ui/react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import React from 'react';
import { HiOutlineShoppingCart } from 'react-icons/hi';
import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import { LineItem } from '@medusajs/medusa';

const fetchCart = async () => {
    const cart = await retrieveCart();

    if (cart?.items.length) {
        const enrichedItems = await enrichLineItems(
            cart?.items,
            cart?.region_id
        );
        cart.items = enrichedItems as LineItem[];
    }

    return cart;
};

export default async function CartButtonMobile() {
    const cart = await fetchCart();

    const totalItems =
        cart?.items?.reduce((acc: any, item: any) => {
            return acc + item.quantity;
        }, 0) || 0;

    return (
        <Flex flexDirection={'row'} alignItems={'center'}>
            <Flex alignSelf={'center'} ml="0.5rem">
                <LocalizedClientLink href="/cart">
                    <Flex
                        position="relative"
                        width={'100%'}
                        color="white"
                        _hover={{
                            '.cart-text, .cart-icon': {
                                color: 'primary.green.900',
                            },
                        }}
                    >
                        <Flex
                            flexDirection={'row'}
                            alignSelf={'center'}
                            color={'white'}
                            _hover={{
                                '.cart-icon': {
                                    color: 'primary.green.900',
                                    transition: 'color 0.3s ease-in-out',
                                },
                            }}
                        >
                            <HiOutlineShoppingCart
                                className="cart-icon"
                                size={'25px'}
                            />
                        </Flex>
                        {totalItems > 0 && (
                            <Flex
                                position="absolute"
                                top="-4px"
                                right="-4px"
                                width="15px"
                                height="15px"
                                borderRadius="full"
                                backgroundColor="#EB4C60"
                                justifyContent="center"
                                alignItems="center"
                                fontSize="10px"
                                color="white"
                                fontWeight="700"
                            >
                                <Text fontSize={'10px'}>{totalItems}</Text>
                            </Flex>
                        )}
                    </Flex>
                </LocalizedClientLink>
            </Flex>
        </Flex>
    );
}
