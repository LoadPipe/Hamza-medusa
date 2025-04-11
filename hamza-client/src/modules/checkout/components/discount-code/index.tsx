'use client';
import React, { useMemo } from 'react';
import { useFormState } from 'react-dom';

import { useQueryClient } from '@tanstack/react-query';
// import Input from '@modules/common/components/input';
import { Button, Flex, Heading, Input } from '@chakra-ui/react';
import { removeDiscount, submitDiscountForm } from '@modules/checkout/actions';
import { formatAmount } from '@lib/util/prices';
import { Trash } from '@medusajs/icons';
import ErrorMessage from '@modules/checkout/components/error-message';
import { Text } from '@chakra-ui/react';
import { CartWithCheckoutStep } from '@/types/global';

const DiscountCode: React.FC<{ cart: CartWithCheckoutStep }> = ({ cart }) => {
    const queryClient = useQueryClient();

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

    // const removeGiftCardCode = async (code: string) => {
    //     await removeGiftCard(code, cart?.gift_cards ?? []);
    // };

    const removeDiscountCode = async () => {
        await removeDiscount(cart?.discounts[0].code);
        await queryClient.invalidateQueries({ queryKey: ['cart'] });
    };

    // Creating a wrapper function that calls the discount form function
    // and invalidates the cart query after completion
    // Create a wrapper around submitDiscountForm
    const handleSubmitDiscountForm = async (
        currentState: unknown,
        formData: FormData
    ) => {
        const result = await submitDiscountForm(currentState, formData);
        // Invalidate the cart query once the discount form has been processed
        await queryClient.invalidateQueries({ queryKey: ['cart'] });
        return result;
    };

    const [message, formAction] = useFormState(handleSubmitDiscountForm, null);

    if (!cart) return null; // ✅ Hide component if no cart data    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Flex mt="1rem" mb="1rem">
            <div className="txt-medium">
                {appliedDiscount ? (
                    <div className="w-full flex items-center text-white">
                        <div className="flex flex-col w-full">
                            <Heading className="txt-medium">
                                Discount applied:
                            </Heading>
                            <div className="flex items-center justify-between w-full max-w-full">
                                <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                                    <span>Code:</span>
                                    <span className="truncate">
                                        {cart?.discounts[0].code}
                                    </span>
                                    <span className="min-w-fit">
                                        ({appliedDiscount})
                                    </span>
                                </Text>
                                <button
                                    className="flex items-center"
                                    onClick={removeDiscountCode}
                                >
                                    <Trash />
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
                                color={'white'}
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
                                type="submit"
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
        </Flex>
    );
};

export default DiscountCode;
