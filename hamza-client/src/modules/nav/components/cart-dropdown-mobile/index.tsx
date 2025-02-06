// import { Popover, Transition } from '@headlessui/react';
'use client';

import { Cart } from '@medusajs/medusa';
import { Button } from '@medusajs/ui';
import { useParams, usePathname } from 'next/navigation';
import { Fragment, useEffect, useRef, useState } from 'react';
import {
    Flex,
    Box,
    Text,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
} from '@chakra-ui/react';
import { formatAmount } from '@lib/util/prices';
import DeleteButton from '@modules/common/components/delete-button';
import LineItemOptions from '@/modules/common/components/line-item/line-item-options';
import LineItemPrice from '@/modules/common/components/line-item/line-item-price';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import Thumbnail from '@modules/products/components/thumbnail';
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

    const { countryCode } = useParams();

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
        <Flex>
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
                        color={'primary.green.900'}
                    >
                        <HiOutlineShoppingCart
                            className="cart-icon"
                            size={'18px'}
                        />
                    </Flex>
                    {totalItems > 0 && (
                        <Flex
                            position="absolute"
                            top="-4px"
                            right="-4px"
                            width="12px"
                            height="12px"
                            borderRadius="full"
                            backgroundColor="#EB4C60"
                            justifyContent="center"
                            alignItems="center"
                            fontSize="10px"
                            color="white"
                            fontWeight="700"
                        >
                            <Text fontSize={'6.41px'}>{totalItems}</Text>
                        </Flex>
                    )}
                </Flex>
            </LocalizedClientLink>
        </Flex>
    );
};

export default CartDropdown;
