import { Heading } from '@medusajs/ui';

import ItemsPreviewTemplate from '@modules/cart/templates/preview';
import DiscountCode from '@modules/checkout/components/discount-code';
import CartTotals from '@modules/common/components/cart-totals';
import Divider from '@modules/common/components/divider';
import { retrieveCart } from '@modules/cart/actions';

const CheckoutSummary = async (params: any) => {
    console.log('calling retrieveCart from checkout-summary');
    console.log(params);
    //let cartId = cookies().get('_medusa_cart_id')?.value;
    let cartId = null;
    if (!cartId && params?.searchParams?.cart)
        cartId = params.searchParams.cart;
    const cart = await retrieveCart(cartId).then((cart) => cart);

    if (!cart) {
        return null;
    }

    return (
        <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 ">
            <div className="w-full bg-black flex flex-col">
                <Divider className="my-6 small:hidden" />
                <Heading
                    level="h2"
                    className="flex flex-row text-3xl-regular items-baseline text-white"
                >
                    In your Cart
                </Heading>
                <Divider className="my-6" />
                <CartTotals data={cart} />
                <ItemsPreviewTemplate
                    region={cart?.region}
                    items={cart?.items}
                />
                <div className="my-6">
                    <DiscountCode cart={cart} />
                </div>
            </div>
        </div>
    );
};

export default CheckoutSummary;
