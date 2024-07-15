'use client';
import { Cart } from '@medusajs/medusa';

// components
import { Flex, Text } from '@chakra-ui/react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
// icon
import { HiOutlineShoppingCart } from 'react-icons/hi';
// functions

const CartButton = ({
    cart: cartState,
}: {
    cart?: Omit<Cart, 'beforeInsert' | 'afterLoad'> | null;
}) => {
    return (
        <>
            <LocalizedClientLink className="w-full" href="/cart">
                <Flex
                    position="relative"
                    width={'100%'}
                    flex={1}
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
                    >
                        <HiOutlineShoppingCart
                            size={30}
                            className="cart-icon"
                        />
                    </Flex>
                    {/* {totalItems > 0 && (
                        <Flex
                            position="absolute"
                            top="-4px"
                            right="-4px"
                            width="14px"
                            height="14px"
                            borderRadius="full"
                            backgroundColor="#EB4C60"
                            justifyContent="center"
                            alignItems="center"
                            color="white"
                        >
                            <Text
                                alignSelf={'center'}
                                fontWeight="600"
                                fontSize={'8.41px'}
                            >
                                {totalItems}
                            </Text>
                        </Flex>
                    )} */}
                </Flex>
            </LocalizedClientLink>
        </>
    );
};

export default CartButton;
