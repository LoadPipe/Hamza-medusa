import { Order } from '@/types/order';

export interface OrderTotals {
    subTotal: number;
    orderShippingTotal: number;
    orderSubTotal: number;
    orderTotalPaid: number;
    orderDiscountTotal: number;
}

export const calculateOrderTotals = (order: Order): OrderTotals => {
    // Calculate subtotal from items
    const subTotal = order.items.reduce(
        (acc: number, item: any) => acc + item.unit_price * item.quantity,
        0
    );

    // Calculate shipping total
    const orderShippingTotal = order.shipping_methods.reduce(
        (shippingTotal: number, method: any) =>
            shippingTotal + (method.price ?? 0),
        0
    );

    // Calculate order subtotal
    const orderSubTotal = subTotal + orderShippingTotal;

    // Calculate total paid from payments
    const orderTotalPaid = order.payments.reduce(
        (paymentTotal: number, payment: any) =>
            paymentTotal + (payment.amount ?? 0),
        0
    );

    // Calculate discount total
    const orderDiscountTotal = orderSubTotal - orderTotalPaid;

    return {
        subTotal,
        orderShippingTotal,
        orderSubTotal,
        orderTotalPaid,
        orderDiscountTotal,
    };
};
