import { useMemo } from 'react';
import { Button } from '@medusajs/ui';

import Thumbnail from '@modules/products/components/thumbnail';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { formatAmount } from '@lib/util/prices';

// Update the type definitions to reflect the structure of the received order
type OrderDetails = {
    thumbnail: string;
    title: string;
    description: string;
};

type Order = {
    id: string;
    display_id: string;
    created_at: string;
    details: OrderDetails;
    paid_total: number;
    currency_code: string;
    region: {
        id: string;
        name: string;
    };
};

type OrderCardProps = {
    order: Order;
};

const OrderCard = ({ order }: OrderCardProps) => {
    return (
        <div className="flex flex-col">
            <div className="uppercase text-large-semi mb-1 text-white">
                Order #{order.display_id}
            </div>
            <div className="flex items-center divide-x divide-gray-200 text-small-regular text-white">
                <span className="pr-2">
                    {new Date(order.created_at).toDateString()}
                </span>
                <span className="px-2">
                    {formatAmount({
                        amount: order.paid_total,
                        currency_code: order.currency_code,
                        region: order.region,
                        includeTaxes: false,
                    })}
                </span>
                <span className="pl-2">1 item</span>{' '}
                {/* Static '1 item' since there are no items array */}
            </div>
            <div className="my-4">
                <Thumbnail
                    thumbnail={order.details.thumbnail}
                    images={[]}
                    height="60px"
                />
                <div className="text-small-regular text-white mt-2">
                    <span className="font-semibold">{order.details.title}</span>
                    <p>{order.details.description}</p>
                </div>
            </div>
            <div className="flex justify-end">
                <LocalizedClientLink
                    href={`/account/orders/details/${order.id}`}
                    passHref
                >
                    <Button variant="secondary">See details</Button>
                </LocalizedClientLink>
            </div>
        </div>
    );
};

export default OrderCard;
