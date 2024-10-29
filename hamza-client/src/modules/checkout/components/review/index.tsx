'use client';

import { Heading, Text, clx } from '@medusajs/ui';

import PaymentButton from '../payment-button';
import { useSearchParams } from 'next/navigation';
import { Cart } from '@medusajs/medusa';
import HamzaLogoLoader from '@/components/loaders/hamza-logo-loader';

const Review = ({
    cart,
}: {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
}) => {
    const searchParams = useSearchParams();

    const isOpen = searchParams.get('step') === 'review';

    const previousStepsCompleted =
        cart.shipping_address &&
        cart.shipping_methods.length > 0 &&
        cart.payment_session;

    console.log('****** shipping methods *****', cart.shipping_methods);
    console.log('****** shipping methods *****', cart);

    return (
        <div className="bg-black">
            <div className="flex flex-row items-center justify-between mb-6">
                <Heading
                    level="h2"
                    className={clx(
                        'flex flex-row text-3xl-regular gap-x-2 items-baseline text-white',
                        {
                            'opacity-50 pointer-events-none select-none':
                                !isOpen,
                        }
                    )}
                >
                    Review
                </Heading>
            </div>
            {isOpen && previousStepsCompleted && (
                <>
                    <div className="flex items-start gap-x-1 w-full mb-6">
                        <div className="w-full">
                            <Text className="txt-medium-plus text-white mb-1">
                                By clicking the Place Order button, you confirm
                                that you have read, understand and accept our
                                Terms of Use, Terms of Sale and Returns Policy
                                and acknowledge that you have read Medusa
                                Store&apos;s Privacy Policy.
                            </Text>
                        </div>
                    </div>

                    <PaymentButton cart={cart} />
                </>
            )}
        </div>
    );
};

export default Review;
