import moment from 'moment';
import { Order } from 'src/models/order';
import { formatCryptoPrice } from '../price-formatter';
import fs from 'fs';

export default function ordersDataParser(orders: Order[]) {
    let parsedData = {};

    orders.forEach((order) => {
        if (parsedData[order.store_id]) {
            parsedData[order.store_id].orders.push({
                orderId: order.id,
                items: order.cart.items
                    .filter(
                        (a) => a.variant.product.store_id === order.store_id
                    )
                    .map((a) => {
                        return {
                            thumbnail: a.thumbnail,
                            title: a.title,
                            quantity: a.quantity,
                            unit_price: `${formatCryptoPrice(
                                a.unit_price,
                                order.currency_code
                            )} ${order.currency_code}`,
                        };
                    }),
                orderDate: moment(order.created_at).format(
                    'MMMM Do YYYY, h:mm:ss a'
                ),
                orderAmount: `${formatCryptoPrice(
                    order.payments[0].amount,
                    order.currency_code
                )} ${order.currency_code}`,
            });
        } else {
            parsedData[order.store_id] = {
                orders: [
                    {
                        orderId: order.id,
                        items: order.cart.items
                            .filter(
                                (a) =>
                                    a.variant.product.store_id ===
                                    order.store_id
                            )
                            .map((a) => {
                                return {
                                    thumbnail: a.thumbnail,
                                    title: a.title,
                                    quantity: a.quantity,
                                    unit_price: `${formatCryptoPrice(
                                        a.unit_price,
                                        order.currency_code
                                    )} ${order.currency_code}`,
                                };
                            }),
                        orderDate: moment(order.created_at).format(
                            'MMMM Do YYYY, h:mm:ss a'
                        ),
                        orderAmount: `${formatCryptoPrice(
                            order.payments[0].amount,
                            order.currency_code
                        )} ${order.currency_code}`,
                    },
                ],
                storeName: order.store.name,
                storeId: order.store_id,
                currencyCode: order.currency_code,
            };
        }
    });

    // console.log('parsed data');
    // console.dir(parsedData, { depth: null });
    return parsedData;
}
