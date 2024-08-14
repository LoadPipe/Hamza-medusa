import { Customer, Order } from '@medusajs/medusa';
import { Container } from '@medusajs/ui';
import { formatAmount } from '@lib/util/prices';
import ChevronDown from '@modules/common/icons/chevron-down';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import { formatCryptoPrice } from '@lib/util/get-product-price';

type OverviewProps = {
    customer: Omit<Customer, 'password_hash'> | null;
    orders: Order[] | null;
};

//TODO: (HIGH) need wallet_address property on customer
const Overview = ({ customer, orders }: OverviewProps) => {
    console.log(`Customer orders are`);
    console.log(`Orders are ${JSON.stringify(orders?.length)}`);

    const getAmount = (amount: number | null, currency_code: string) => {
        if (amount === null || amount === undefined) {
            return;
        }

        return formatCryptoPrice(amount, currency_code || 'USDC');
    };

    return (
        <div>
            <div className="hidden small:block bg-black text-white p-8">
                <div className="text-xl-semi flex justify-between items-center mb-4">
                    <span>Hello {customer?.first_name}</span>
                    <span className="text-small-regular text-ui-fg-base">
                        Signed in as:{' '}
                        <span className="font-semibold">
                            {customer?.email?.substring(0, 42)}
                        </span>
                    </span>
                </div>
                <div className="flex flex-col py-8 border-t border-gray-200">
                    <div className="flex flex-col gap-y-4 h-full col-span-1 row-span-2 flex-1">
                        <div className="flex items-start gap-x-16 mb-6">
                            <div className="flex flex-col gap-y-4">
                                <h3 className="text-large-semi">Profile</h3>
                                <div className="flex items-end gap-x-2">
                                    <span className="text-3xl-semi leading-none">
                                        {getProfileCompletion(customer)}%
                                    </span>
                                    <span className="uppercase text-base-regular text-ui-fg-subtle">
                                        Completed
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-y-4">
                                <h3 className="text-large-semi">Addresses</h3>
                                <div className="flex items-end gap-x-2">
                                    <span className="text-3xl-semi leading-none">
                                        {customer?.shipping_addresses?.length ||
                                            0}
                                    </span>
                                    <span className="uppercase text-base-regular text-ui-fg-subtle">
                                        Saved
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-y-4">
                            <div className="flex items-center gap-x-2">
                                <h3 className="text-large-semi">
                                    Recent orders
                                </h3>
                            </div>
                            <ul className="flex flex-col gap-y-4">
                                {orders && orders.length > 0 ? (
                                    orders.slice(0, 5).map((order) => {
                                        return (
                                            <li key={order.id}>
                                                <LocalizedClientLink
                                                    href={`/account/orders/details/${order.id}`}
                                                >
                                                    <Container className="bg-gray-50 flex justify-between items-center p-4 bg-black text-white">
                                                        <div className="grid grid-cols-3 grid-rows-2 text-small-regular gap-x-4 flex-1">
                                                            <span className="font-semibold">
                                                                Date placed
                                                            </span>
                                                            <span className="font-semibold">
                                                                Order number
                                                            </span>
                                                            <span className="font-semibold">
                                                                Total amount
                                                            </span>
                                                            <span>
                                                                {new Date(
                                                                    order.created_at
                                                                ).toDateString()}
                                                            </span>
                                                            <span>
                                                                #
                                                                {
                                                                    order.display_id
                                                                }
                                                            </span>
                                                            <span>
                                                                {getAmount(
                                                                    order.paid_total,
                                                                    order.currency_code
                                                                )}{' '}
                                                                {
                                                                    order.currency_code
                                                                }
                                                            </span>
                                                        </div>
                                                        <button className="flex items-center justify-between">
                                                            <span className="sr-only">
                                                                Go to order #
                                                                {
                                                                    order.display_id
                                                                }
                                                            </span>
                                                            <ChevronDown className="-rotate-90" />
                                                        </button>
                                                    </Container>
                                                </LocalizedClientLink>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <span>No recent orders</span>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getProfileCompletion = (
    customer: Omit<Customer, 'password_hash'> | null
) => {
    let count = 0;

    if (!customer) {
        return 0;
    }

    if (customer.email) {
        count++;
    }

    if (customer.first_name && customer.last_name) {
        count++;
    }

    if (customer.phone) {
        count++;
    }

    if (customer.billing_address) {
        count++;
    }

    return (count / 4) * 100;
};

export default Overview;
