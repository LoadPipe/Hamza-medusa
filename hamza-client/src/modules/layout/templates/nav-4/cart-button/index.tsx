import { LineItem } from '@medusajs/medusa';

import { enrichLineItems, retrieveCart } from '@modules/cart/actions';

import CartButton from './components/cart-button';

const fetchCart = async () => {
    const cart = await retrieveCart();

    if (cart?.items.length) {
        const enrichedItems = await enrichLineItems(
            cart?.items,
            cart?.region_id
        );
        cart.items = enrichedItems as LineItem[];
    }

    return cart;
};

export default async function CartWrapper() {
    const cart = await fetchCart();

    return <CartButton cart={cart} />;
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
