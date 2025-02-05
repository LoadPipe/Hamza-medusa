'use client';

import { Cart } from '@medusajs/medusa';
import React, { useMemo } from 'react';
import { useFormState } from 'react-dom';

import { useQuery } from '@tanstack/react-query';
import { fetchCartForCheckout } from '@/app/[countryCode]/(checkout)/checkout/utils/fetch-cart-for-checkout';
import { fetchCartForCart } from '@/app/[countryCode]/(main)/cart/utils/fetch-cart-for-cart';
// import Input from '@modules/common/components/input';
import { Button, Flex, Box, Input } from '@chakra-ui/react';
import {
    removeDiscount,
    removeGiftCard,
    submitDiscountForm,
} from '@modules/checkout/actions';
import { formatAmount } from '@lib/util/prices';

type DiscountCodeProps = {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
};


const DiscountCode: React.FC<{cartId?: string}> = ({ cartId }) => {
    const { data: cart } = useQuery({
        queryKey: ['cart'],
        queryFn: () => (cartId ? fetchCartForCheckout(cartId) : fetchCartForCart()),
        staleTime: 1000 * 60 * 5, // ✅ Cache cart data for 5 minutes
    });


    const appliedDiscount = useMemo(() => {
        if (!cart?.discounts || !cart?.discounts.length) {
            return undefined;
        }

        switch (cart?.discounts[0].rule.type) {
            case 'percentage':
                return `${cart?.discounts[0].rule.value}%`;
            case 'fixed':
                return `- ${formatAmount({
                    amount: cart?.discounts[0].rule.value,
                    region: cart?.region,
                    currency_code: '',
                })}`;

            default:
                return 'Free shipping';
        }
    }, [cart?.discounts, cart?.region]);

    const removeGiftCardCode = async (code: string) => {
        await removeGiftCard(code, cart?.gift_cards ?? []);
    };

    const removeDiscountCode = async () => {
        await removeDiscount(cart?.discounts[0].code);
    };

    const [message, formAction] = useFormState(submitDiscountForm, null);

    if (!cart) return null; // ✅ Hide component if no cart data    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Flex mt="1rem">
            <Input
                borderLeftRadius={'12px'}
                height={{ base: '50px', md: '52px' }}
                width={'100%'}
                fontSize={{ base: '15px', md: '16px' }}
                backgroundColor={'black'}
                borderWidth={'0'}
                placeholder="Discount Code"
            />
            <Button
                borderLeftRadius={'0'}
                borderRightRadius={'12px'}
                height={{ base: '50px', md: '52px' }}
                width={'82px'}
                fontSize={{ base: '15px', md: '16px' }}
                backgroundColor={'primary.green.900'}
                color={'black'}
            >
                Apply
            </Button>
        </Flex>
    );
};

export default DiscountCode;

/*

  <div className="txt-medium">
                {gift_cards.length > 0 && (
                    <div className="flex flex-col mb-4">
                        <Heading className="txt-medium">
                            Gift card(s) applied:
                        </Heading>
                        {gift_cards?.map((gc) => (
                            <div
                                className="flex items-center justify-between txt-small-plus"
                                key={gc.id}
                            >
                                <Text className="flex gap-x-1 items-baseline">
                                    <span>Code: </span>
                                    <span className="truncate">{gc.code}</span>
                                </Text>
                                <Text className="font-semibold">
                                    {formatAmount({
                                        region: region,
                                        amount: gc.balance,
                                        includeTaxes: false,
                                        currency_code: '',
                                    }).toString()}
                                </Text>
                                <button
                                    className="flex items-center gap-x-2 !background-transparent !border-none"
                                    onClick={() => removeGiftCardCode(gc.code)}
                                >
                                    <Trash size={14} />
                                    <span className="sr-only">
                                        Remove gift card from order
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {appliedDiscount ? (
                    <div className="w-full flex items-center">
                        <div className="flex flex-col w-full">
                            <Heading className="txt-medium">
                                Discount applied:
                            </Heading>
                            <div className="flex items-center justify-between w-full max-w-full">
                                <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                                    <span>Code:</span>
                                    <span className="truncate">
                                        {discounts[0].code}
                                    </span>
                                    <span className="min-w-fit">
                                        ({appliedDiscount})
                                    </span>
                                </Text>
                                <button
                                    className="flex items-center"
                                    onClick={removeDiscountCode}
                                >
                                    <Trash size={14} />
                                    <span className="sr-only">
                                        Remove discount code from order
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form action={formAction} className="w-full">
                        <Flex>
                            <Input
                                borderLeftRadius={'16px'}
                                style={{ height: '52px' }}
                                placeholder="Discount Code"
                                backgroundColor={'#121212'}
                                borderWidth={'0'}
                                name="code"
                                type="text"
                                autoFocus={false}
                            />
                            <Button
                                height={'52px'}
                                backgroundColor={'primary.green.900'}
                                color={'black'}
                                variant="secondary"
                            >
                                Apply
                            </Button>
                        </Flex>
                        <ErrorMessage error={message} />
                    </form>
                )}
            </div>

*/
