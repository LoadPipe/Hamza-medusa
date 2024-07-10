'use client';

import { Cart, PaymentSession } from '@medusajs/medusa';
import React from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

type WrapperProps = {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
    children: React.ReactNode;
};

const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

const Wrapper: React.FC<WrapperProps> = ({ cart, children }) => {
    const paymentSession = cart.payment_session as PaymentSession;

    if (
        paymentSession?.provider_id === 'paypal' &&
        paypalClientId !== undefined &&
        cart
    ) {
        return (
            <PayPalScriptProvider
                options={{
                    'client-id': 'test',
                    currency: cart?.region.currency_code.toUpperCase(),
                    intent: 'authorize',
                    components: 'buttons',
                }}
            >
                {children}
            </PayPalScriptProvider>
        );
    }

    return <div>{children}</div>;
};

export default Wrapper;
