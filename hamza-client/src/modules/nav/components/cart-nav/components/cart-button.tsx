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

    // Clean up the timer when the component unmounts
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
                    {totalItems > 0 && (
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
                    )}
                </Flex>
            </LocalizedClientLink>
        </>
    );
};

export default CartDropdown;

{
    /* <Transition
show={cartDropdownOpen}
as={Fragment}
enter="transition ease-out duration-200"
enterFrom="opacity-0 translate-y-1"
enterTo="opacity-100 translate-y-0"
leave="transition ease-in duration-150"
leaveFrom="opacity-100 translate-y-0"
leaveTo="opacity-0 translate-y-1"
>
<Popover.Panel
    static
    className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-black border-x border-b border-gray-200 w-[420px] text-ui-fg-base"
>
    <div className="p-4 flex items-center justify-center text-white">
        <h3 className="text-large-semi">Cart</h3>
    </div>
    {cartState && cartState.items?.length ? (
        <>
            <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
                {cartState.items
                    .sort((a, b) => {
                        return a.created_at > b.created_at
                            ? -1
                            : 1;
                    })
                    .map((item) => (
                        <div
                            className="grid grid-cols-[122px_1fr] gap-x-4"
                            key={item.id}
                        >
                            <LocalizedClientLink
                                href={`/products/${item.variant.product.handle}`}
                                className="w-24"
                            >
                                <Thumbnail
                                    thumbnail={
                                        item.thumbnail
                                    }
                                    size="square"
                                />
                            </LocalizedClientLink>
                            <div className="flex flex-col justify-between flex-1">
                                <div className="flex flex-col flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                            <h3 className="text-base-regular overflow-hidden text-ellipsis">
                                                <LocalizedClientLink
                                                    href={`/products/${item.variant.product.handle}`}
                                                >
                                                    {
                                                        item.title
                                                    }
                                                </LocalizedClientLink>
                                            </h3>
                                            <LineItemOptions
                                                variant={
                                                    item.variant
                                                }
                                            />
                                            <span>
                                                Quantity:{' '}
                                                {
                                                    item.quantity
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-end">
                                            <LineItemPrice
                                                region={
                                                    cartState.region
                                                }
                                                item={item}
                                                style="tight"
                                                currencyCode={currencyCode}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DeleteButton
                                    id={item.id}
                                    className="mt-1"
                                >
                                    Remove
                                </DeleteButton>
                            </div>
                        </div>
                    ))}
            </div>
            <div className="p-4 flex flex-col gap-y-4 text-small-regular">
                <div className="flex items-center justify-between">
                    <span className="text-ui-fg-base font-semibold">
                        Subtotal{' '}
                        <span className="font-normal">
                            (excl. taxes)
                        </span>
                    </span>
                    <span className="text-large-semi">
                        {formatAmount({
                            amount: cartState.subtotal || 0,
                            region: cartState.region,
                            includeTaxes: false,
                            currency_code: '',
                        }).toString()}
                    </span>
                </div>
                <LocalizedClientLink href="/cart" passHref>
                    <Button className="w-full" size="large">
                        Go to cart
                    </Button>
                </LocalizedClientLink>
                <LocalizedClientLink
                    href="/checkout?step=address"
                    passHref
                >
                    <Button className="w-full" size="large">
                        Go to checkout
                    </Button>
                </LocalizedClientLink>
            </div>
        </>
    ) : (
        <div>
            <div className="flex py-16 flex-col gap-y-4 items-center justify-center">
                <div className="bg-gray-900 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white">
                    <span>0</span>
                </div>
                <span>Your shopping bag is empty.</span>
                <div>
                    <LocalizedClientLink href="/shop">
                        <>
                            <span className="sr-only">
                                Go to all products page
                            </span>
                            <Button onClick={close}>
                                Explore products
                            </Button>
                        </>
                    </LocalizedClientLink>
                </div>
            </div>
        </div>
    )}
</Popover.Panel>
</Transition> */
}
