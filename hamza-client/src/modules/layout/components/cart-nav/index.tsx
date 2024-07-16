'use client';

import React, { useState, useEffect } from 'react';
import { LineItem, Cart } from '@medusajs/medusa';
import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import CartDropdown from './components/cart-button';

const fetchCartData = async (): Promise<Omit<
    Cart,
    'refundable_amount' | 'refunded_total'
> | null> => {
    const cart = await retrieveCart();
    if (cart?.items.length) {
        const enrichedItems = await enrichLineItems(cart.items, cart.region_id);
        cart.items = enrichedItems as LineItem[];
    }
    return cart;
};

export default function CartButton() {
    const [cart, setCart] = useState<Omit<
        Cart,
        'refundable_amount' | 'refunded_total'
    > | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const cartData = await fetchCartData();
            setCart(cartData);
        };
        fetchData();
    }, []);

    return <CartDropdown cart={cart} />;
}

// import { LineItem } from '@medusajs/medusa';

// import { enrichLineItems, retrieveCart } from '@modules/cart/actions';

// import CartDropdown from '../cart-dropdown';

// const fetchCart = async () => {
//     const cart = await retrieveCart();

//     if (cart?.items.length) {
//         const enrichedItems = await enrichLineItems(
//             cart?.items,
//             cart?.region_id
//         );
//         cart.items = enrichedItems as LineItem[];
//     }

//     return cart;
// };

// export default async function CartButton() {
//     const cart = await fetchCart();

//     return <CartDropdown cart={cart} />;
// }
