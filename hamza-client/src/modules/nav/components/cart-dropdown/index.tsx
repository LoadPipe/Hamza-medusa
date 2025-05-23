'use client';

import { Cart } from '@medusajs/medusa';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { HiOutlineShoppingCart } from 'react-icons/hi';

const CartDropdown = ({
    cart: cartState,
}: {
    cart?: Omit<Cart, 'beforeInsert' | 'afterLoad'> | null;
}) => {
    const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
        undefined
    );
    const [cartDropdownOpen, setCartDropdownOpen] = useState(false);

    const open = () => setCartDropdownOpen(true);
    const close = () => setCartDropdownOpen(false);

    const totalItems =
        cartState?.items?.reduce((acc: any, item: any) => {
            return acc + item.quantity;
        }, 0) || 0;

    const itemRef = useRef<number>(totalItems || 0);

    const timedOpen = () => {
        open();

        const timer = setTimeout(close, 5000);

        setActiveTimer(timer);
    };

    const openAndCancel = () => {
        if (activeTimer) {
            clearTimeout(activeTimer);
        }

        open();
    };

    // Clean up the timer when the components unmounts
    useEffect(() => {
        return () => {
            if (activeTimer) {
                clearTimeout(activeTimer);
            }
        };
    }, [activeTimer]);

    const pathname = usePathname();

    // open cart dropdown when modifying the cart items, but only if we're not on the cart page
    useEffect(() => {
        if (itemRef.current !== totalItems && !pathname.includes('/cart')) {
            timedOpen();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalItems, itemRef.current]);

    return (
        <Flex width={'100%'}>
            <LocalizedClientLink className="w-full" href="/cart">
                <Flex
                    width={'100%'}
                    flex={1}
                    color="white"
                    _hover={{
                        '.cart-text, .cart-icon': {
                            color: 'primary.green.900',
                        },
                    }}
                >
                    <Flex flexDirection={'row'} alignSelf={'center'}>
                        <HiOutlineShoppingCart
                            className="cart-icon"
                            size={'24px'}
                        />
                        <Text
                            className="cart-text"
                            fontSize={'16px'}
                            fontWeight={'700'}
                            ml="5px"
                            _hover={{ color: 'primary.green.900' }}
                        >
                            Cart
                        </Text>
                    </Flex>
                    <Flex
                        width={'21px'}
                        height={'21px'}
                        borderRadius={'full'}
                        backgroundColor={'#EB4C60'}
                        ml="auto"
                        justifyContent={'center'}
                        alignItems={'center'}
                        alignSelf={'center'}
                    >
                        <Text
                            fontSize={'13px'}
                            fontWeight={'700'}
                            alignSelf={'center'}
                        >{`${totalItems}`}</Text>
                    </Flex>
                </Flex>
            </LocalizedClientLink>
        </Flex>
    );
};

export default CartDropdown;
