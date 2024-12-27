import { Order } from '@medusajs/medusa';
import { formatCryptoPrice } from '@lib/util/get-product-price';

type OrderSummaryProps = {
    order: Order;
};

const OrderSummary = ({ order }: OrderSummaryProps) => {
    const getAmount = (amount?: number | null) => {
        if (amount === null || amount === undefined) {
            return;
        }

        return formatCryptoPrice(amount, order.currency_code || 'usdc');
    };

    return (
        <div>
            <h2 className="text-base-semi ">Order Summary</h2>
            <div className="text-small-regular  my-2">
                <div className="flex items-center justify-between text-base-regular mb-2">
                    <span>Subtotal</span>
                    <span>
                        {getAmount(order.paid_total)} {order.currency_code}
                    </span>
                </div>
                <div className="flex flex-col gap-y-1">
                    <div className="flex items-center justify-between">
                        <span>Discount</span>
                        <span>- {getAmount(order.discount_total)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Gift Card</span>
                        <span>- {getAmount(order.gift_card_total)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Shipping</span>
                        <span>{getAmount(order.shipping_total)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Taxes</span>
                        <span>{getAmount(order.tax_total)}</span>
                    </div>
                </div>
                <div className="h-px w-full border-b border-gray-200 border-dashed my-4" />
                <div className="flex items-center justify-between text-base-regular text-ui-fg-base mb-2">
                    <span>Total</span>
                    <span>
                        {getAmount(order.paid_total)} {order.currency_code}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
