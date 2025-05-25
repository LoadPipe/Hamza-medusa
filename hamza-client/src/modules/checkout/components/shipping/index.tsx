'use client';

import { RadioGroup } from '@headlessui/react';
import { CheckCircleSolid } from '@medusajs/icons';
import { Cart } from '@medusajs/medusa';
import { PricedShippingOption } from '@medusajs/medusa/dist/types/pricing';
import { Heading, Text, clx, useToggleState } from '@medusajs/ui';
import { Button } from '@chakra-ui/react';
import { formatAmount } from '@lib/util/prices';
import Divider from '@modules/common/components/divider';
import Radio from '@modules/common/components/radio';
import Spinner from '@modules/common/icons/spinner';
import ErrorMessage from '@modules/checkout/components/error-message';
import { setShippingMethod } from '@modules/checkout/actions';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { setPaymentMethod } from '@modules/checkout/actions';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';
import { addDefaultShippingMethod } from '@/lib/server';

type ShippingProps = {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
    availableShippingMethods: PricedShippingOption[] | null;
};

const Shipping: React.FC<ShippingProps> = ({
    cart,
    availableShippingMethods,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { authData, preferred_currency_code } = useCustomerAuthStore();
    //console.log('user preferred currency code: ', preferred_currency_code);

    const isOpen = searchParams.get('step') === 'delivery';
    const cartId = isOpen ? searchParams.get('cart') : cart?.id;

    const handleEdit = () => {
        router.push(pathname + `?step=delivery&cart=${cart?.id}`, {
            scroll: false,
        });
    };

    const handleSubmit = () => {
        setIsLoading(true);
        addDefaultShippingMethod(cart).then(() => {
            router.push(pathname + '?step=review', {
                scroll: false,
            });
        });
        //router.push(pathname + '?step=payment', { scroll: false });
    };

    const set = async (id: string) => {
        setIsLoading(true);
        await setShippingMethod(id)
            .then(() => {
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.toString());
                setIsLoading(false);
            });
        //set payment method to crypto
        await setPaymentMethod('crypto')
            .catch((err) => setError(err.toString()))
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleChange = (value: string) => {
        set(value);
    };

    // useEffect(() => {
    //     setIsLoading(false);
    //     setError(null);

    //     if (cart?.shipping_methods?.length) {
    //         set(
    //             cart.shipping_methods?.length
    //                 ? cart.shipping_methods[0]?.shipping_option_id
    //                 : ''
    //         );
    //     } else {
    //         if (isOpen) {
    //             console.log('adding default shipping');
    //             addDefaultShippingMethod(cart?.id).then(() => {
    //                 router.push(pathname + '?step=review', {
    //                     scroll: false,
    //                 });
    //             });
    //         }
    //     }
    // }, [isOpen]);

    return (
        <div className="bg-black">
            <div className="flex flex-row items-center justify-between mb-6">
                <Heading
                    level="h2"
                    className={clx(
                        'flex flex-row text-3xl-regular gap-x-2 items-baseline text-white',
                        {
                            'opacity-50 pointer-events-none select-none':
                                !isOpen && cart?.shipping_methods?.length === 0,
                        }
                    )}
                >
                    Delivery
                    {!isOpen && cart?.shipping_methods?.length > 0 && (
                        <CheckCircleSolid />
                    )}
                </Heading>
                {!isOpen &&
                    cart?.shipping_address &&
                    cart?.billing_address &&
                    cart?.email && (
                        <Text>
                            <button
                                onClick={handleEdit}
                                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                            >
                                Edit
                            </button>
                        </Text>
                    )}
            </div>
            {isOpen ? (
                <div>
                    <div className="pb-8">
                        <RadioGroup
                            value={
                                cart?.shipping_methods?.length
                                    ? cart?.shipping_methods[0]
                                          ?.shipping_option_id
                                    : ''
                            }
                            onChange={(value: string) => handleChange(value)}
                        >
                            {availableShippingMethods ? (
                                availableShippingMethods.map((option) => {
                                    return (
                                        <RadioGroup.Option
                                            key={option.id}
                                            value={option.id}
                                            className={clx(
                                                'flex items-center justify-between text-white text-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-borders-interactive-with-active',
                                                {
                                                    'border-ui-border-interactive':
                                                        option.id ===
                                                        (cart?.shipping_methods
                                                            ?.length
                                                            ? cart
                                                                  ?.shipping_methods[0]
                                                                  ?.shipping_option_id
                                                            : ''),
                                                }
                                            )}
                                            style={{ color: 'white' }} // Inline style for testing
                                        >
                                            <div className="flex items-center gap-x-4">
                                                <Radio
                                                    checked={
                                                        option.id ===
                                                        (cart?.shipping_methods
                                                            ?.length
                                                            ? cart
                                                                  ?.shipping_methods[0]
                                                                  ?.shipping_option_id
                                                            : '')
                                                    }
                                                />
                                                <span className="text-base-regular">
                                                    {option.name}
                                                </span>
                                            </div>
                                            <span className="justify-self-end text-white">
                                                {formatCryptoPrice(
                                                    option.amount ?? 0,
                                                    preferred_currency_code ??
                                                        'usdc'
                                                )}{' '}
                                                {preferred_currency_code?.toUpperCase()}
                                            </span>
                                        </RadioGroup.Option>
                                    );
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center px-4 py-8 text-ui-fg-base">
                                    <Spinner />
                                </div>
                            )}
                        </RadioGroup>
                    </div>

                    <ErrorMessage error={error} />

                    <Button
                        height={'52px'}
                        backgroundColor={'primary.indigo.900'}
                        color={'white'}
                        className="mt-6 text-white py-3 px-6  text-base"
                        onClick={handleSubmit}
                        _hover={{
                            backgroundColor: 'white',
                            color: 'black',
                        }}
                        isLoading={isLoading}
                        disabled={
                            !cart?.shipping_methods?.length ||
                            !cart?.shipping_methods[0]
                        }
                    >
                        Continue to payment
                    </Button>
                </div>
            ) : (
                <div>
                    <div className="text-small-regular">
                        {cart && cart?.shipping_methods.length > 0 && (
                            <div className="flex flex-col w-1/3">
                                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                                    Method
                                </Text>
                                <Text className="txt-medium text-white">
                                    {cart?.shipping_methods?.length
                                        ? cart?.shipping_methods[0]
                                              .shipping_option?.name
                                        : ' '}{' '}
                                    (
                                    {
                                        cart?.shipping_methods[0]
                                            ?.shipping_option.amount
                                    }
                                    )
                                </Text>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <Divider className="mt-8" />
        </div>
    );
};

export default Shipping;
