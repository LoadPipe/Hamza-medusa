import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import { LineItem, Cart, Store } from '@medusajs/medusa';
import { CartWithCheckoutStep } from '@/types/global';
import { getCheckoutStep } from '@lib/util/get-checkout-step';
import {
    addDefaultShippingMethod,
    getCartShippingCost,
    getShippingMethods,
} from '@/lib/server';
import { setBestShippingAddress } from '@/lib/server';

type StoreWithItems = MedusaStore & {
    items: LineItem[];
};

type MedusaStore = Store & {
    icon: string;
};

export const fetchCartForCart =
    async (): Promise<CartWithCheckoutStep | null> => {
        let cart = await retrieveCart();

        if (!cart) return null;

        if (cart.items.length) {
            const enrichedItems = await enrichLineItems(
                cart.items,
                cart.region_id
            );
            cart.items = enrichedItems as LineItem[];
        }

        // handle shipping address
        if (!cart.shipping_address_id) {
            const address = await setBestShippingAddress(cart);
            if (address) {
                cart = await retrieveCart();
            }
        }

        // add default shipping method
        const shippingMethod = await addDefaultShippingMethod(cart);
        if (shippingMethod) {
            const sm = await getShippingMethods(cart.id);
            if (sm) {
                cart.shipping_methods = sm;
            }
        }

        // ✅ Ensure `checkout_step` is always assigned
        cart.checkout_step = getCheckoutStep(cart) || 'shipping';

        return cart;
    };

// refactor organization of store with items
export const organizeCartItemsByStore = (
    cart: CartWithCheckoutStep
): StoreWithItems[] => {
    // refactor organization of store with items
    let stores: StoreWithItems[] = [];
    cart?.items.forEach((item) => {
        const store = item.variant.product.store;
        let storeIndex = stores.findIndex((s) => s.name === store.name);
        if (storeIndex === -1) {
            stores.push({ ...store, items: [item] });
        } else {
            stores[storeIndex].items.push(item);
        }
    });

    return stores;
};
