import { Heading } from '@medusajs/ui';

import ItemsPreviewTemplate from '@modules/cart/templates/preview';
import DiscountCode from '@modules/checkout/components/discount-code';
import CartTotals from '@modules/common/components/cart-totals';
import Divider from '@modules/common/components/divider';
import { enrichLineItems, retrieveCart } from '@modules/cart/actions';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import { LineItem } from '@medusajs/medusa';

const CheckoutSummary = async (params: any) => {
    const cartId = params.cartId;
    const cart = await retrieveCart(cartId).then((cart) => cart);

    if (!cart) {
        console.log('cart not found');
        return null;
    }

    if (cart?.items.length) {
        const enrichedItems = await enrichLineItems(
            cart?.items,
            cart?.region_id
        );
        cart.items = enrichedItems as LineItem[];
    }

    return (
        <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 ">
            <div className="w-full bg-black flex flex-col">
                <Divider className="my-6 small:hidden" />
                <Heading
                    level="h2"
                    className="flex flex-row text-3xl-regular items-baseline text-white mb-4"
                >
                    In your Cart
                </Heading>

                <CartTotals data={cart} useCartStyle={false} />
                <ItemsPreviewTemplate
                    region={cart?.region}
                    items={cart?.items}
                    currencyCode={params.currencyCode ?? undefined}
                />
                <div className="my-6">
                    <DiscountCode cart={cart} />
                </div>
            </div>
        </div>
    );
};

export default CheckoutSummary;
