import Addresses from '@modules/checkout/components/addresses';
import Shipping from '@modules/checkout/components/shipping';
import Payment from '@modules/checkout/components/payment';
import Review from '@modules/checkout/components/review';
import {
    createPaymentSessions,
    getCustomer,
    listShippingMethods,
} from '@lib/data';
import { cookies } from 'next/headers';
import { CartWithCheckoutStep } from 'types/global';
import { getCheckoutStep } from '@lib/util/get-checkout-step';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import ChevronDown from '@modules/common/icons/chevron-down';

export default async function CheckoutForm(params: any) {
    const cartId = params.cartId;

    if (!cartId) {
        return null;
    }

    // create payment sessions and get cart
    const cart = (await createPaymentSessions(cartId).then(
        (cart) => cart
    )) as CartWithCheckoutStep;

    if (!cart) {
        return null;
    }

    cart.checkout_step = cart && getCheckoutStep(cart);
    console.log(cart.checkout_step);

    // get available shipping methods
    const availableShippingMethods = await listShippingMethods(
        cart.region_id
    ).then((methods) => methods?.filter((m) => !m.is_return));

    if (!availableShippingMethods) {
        return null;
    }

    // get customer if logged in
    const customer = await getCustomer();

    return (
        <div>
            <div className="w-full grid grid-cols-1 gap-y-8">
                <LocalizedClientLink
                    href="/cart"
                    className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase flex-1 basis-0"
                >
                    <ChevronDown className="rotate-90" size={16} />
                    <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base ">
                        Back to shopping cart
                    </span>
                    <span className="mt-px block small:hidden txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
                        Back
                    </span>
                </LocalizedClientLink>
                <div>
                    <Addresses cart={cart} customer={customer} />
                </div>

                <div>
                    <Shipping
                        cart={cart}
                        availableShippingMethods={availableShippingMethods}
                    />
                </div>

                <div>
                    <Payment cart={cart} />
                </div>

                <div>
                    <Review cart={cart} />
                </div>
            </div>
        </div>
    );
}
