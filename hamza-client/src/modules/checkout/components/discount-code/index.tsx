'use client';

import React, { useMemo } from 'react';
import { useFormState } from 'react-dom';
import { Cart } from '@medusajs/medusa';
import { Button, Flex, Input, Box, Text } from '@chakra-ui/react';
import Trash from '@modules/common/icons/trash';
import ErrorMessage from '@modules/checkout/components/error-message';
import { submitDiscountForm, removeDiscount } from '@modules/checkout/actions';
import { formatAmount } from '@lib/util/prices';

type DiscountCodeProps = {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
};

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
    const { discounts, region } = cart;

    const appliedDiscount = useMemo(() => {
        if (!discounts || !discounts.length) return undefined;

        switch (discounts[0].rule.type) {
            case 'percentage':
                return `${discounts[0].rule.value}%`;
            // case 'fixed':
            //     return `- ${formatAmount({ amount: discounts[0].rule.value, region })}`;
            default:
                return 'Free shipping';
        }
    }, [discounts, region]);

    const [message, formAction] = useFormState(submitDiscountForm, null);

    const removeDiscountCode = async () => {
        await removeDiscount(discounts[0].code);
    };

    return (
        <Box mt="1rem">
            {appliedDiscount ? (
                <Flex align="center" justify="space-between">
                    <Box>
                        <Text fontWeight="bold">Discount applied:</Text>
                        <Text>
                            Code: {discounts[0].code} ({appliedDiscount})
                        </Text>
                    </Box>
                    <Button variant="ghost" onClick={removeDiscountCode}>
                        <Trash size={14} />
                        <span className="sr-only">Remove discount</span>
                    </Button>
                </Flex>
            ) : (
                <form action={formAction} className="w-full">
                    <Flex>
                        <Input
                            borderLeftRadius="16px"
                            height="52px"
                            placeholder="Discount Code"
                            backgroundColor="#121212"
                            borderWidth="0"
                            name="code"
                            type="text"
                        />
                        <Button
                            height="52px"
                            backgroundColor="primary.green.900"
                            color="black"
                            type="submit"
                            borderRightRadius="12px"
                        >
                            Apply
                        </Button>
                    </Flex>
                    <ErrorMessage error={message} />
                </form>
            )}
        </Box>
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
                                        reion: region,
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
