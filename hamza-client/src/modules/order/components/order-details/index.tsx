import { Order } from '@medusajs/medusa';
import { Text } from '@medusajs/ui';

type OrderDetailsProps = {
    order: Order;
    showStatus?: boolean;
};

//TODO: replace the following at top of template when ready
/*

      <Text>
        We have sent the line-item confirmation details to{" "}
        <span className="text-ui-fg-medium-plus font-semibold">
          {line-item.email}
        </span>
        .
      </Text>
      */

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
    const formatStatus = (str: string) => {
        const formatted = str.split('_').join(' ');

        return formatted.slice(0, 1).toUpperCase() + formatted.slice(1);
    };
    // console.log(`Order Summary is ${JSON.stringify(order)}`);

    return (
        <div>
            <Text className="mt-2">
                Order date: {new Date(order.created_at).toDateString()}
            </Text>
            <Text className="mt-2">Order number: {order.display_id}</Text>
            <Text className="mt-2">Order ID: {order.id}</Text>

            <div className="flex items-center text-compact-small gap-x-4 mt-4">
                {showStatus && (
                    <>
                        <Text className="">
                            Order status:{' '}
                            <span className="">
                                {formatStatus(order.fulfillment_status)}
                            </span>
                        </Text>
                        <Text className="">
                            Payment status:{' '}
                            <span className="">
                                {formatStatus(order.payment_status)}
                            </span>
                        </Text>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;
