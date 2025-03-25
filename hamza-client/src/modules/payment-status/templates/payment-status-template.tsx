import React from 'react';
import PaymentStatus from '../components/payment-status';
import PaymentOrders from '../components/payment-orders';

function PaymentStatusTemplate() {
    return (
        <div>
            <PaymentStatus />
            <PaymentOrders />
        </div>
    );
}

export default PaymentStatusTemplate;
