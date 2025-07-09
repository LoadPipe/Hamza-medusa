export function isShippingAddressRequired(cart: any): boolean {
    if (cart?.items?.length == 0) return true;

    for (let n = 0; n < (cart?.items?.length ?? 0); n++) {
        if (
            cart?.items[
                n
            ].variant.product.metadata?.no_shipping_address?.toString() !==
            'true'
        ) {
            return true;
        }
    }
    return false;
}
