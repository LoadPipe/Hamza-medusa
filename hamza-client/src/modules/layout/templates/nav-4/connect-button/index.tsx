import { LineItem } from '@medusajs/medusa';

import { enrichLineItems, retrieveCart } from '@modules/cart/actions';

import CartDropdown from './components/cart-button';
import { WalletConnectButton } from './components/connect-button';

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

export default async function ConnectWallet() {
    const cart = await fetchCart();

    return <WalletConnectButton cart={cart} />;
}
