import { ENDPOINT, serveRequest, validateStoreIdAndKeycard } from './utils';
import { RelayClientWrapper } from '../massmarket/client';
import { bytesToHex, keccak256 } from 'viem';
import { randomBytes } from 'crypto';
function isZeroAddress(value) {
    if (!value)
        return true;
    value = value.trim();
    if (value.length < 1)
        return true;
    if (value.replaceAll('0', '') === 'x')
        return true;
    return false;
}
export const checkoutController = {
    //checkout
    //creates cart, adds items to it, and commits it
    doCheckout: async (req, res) => {
        serveRequest(req, res, async (id, body) => {
            const input = body;
            console.log(JSON.stringify(body));
            console.log(JSON.stringify(input));
            let output = {};
            if (process.env.FAKE_CHECKOUT) {
                output = {
                    success: true,
                    contractAddress: '0x0DcA1518DB5A058F29EBfDab76739faf8Fb4544c',
                    amount: '21000000000',
                    orderId: bytesToHex(randomBytes(32)),
                    chainId: 11155111,
                    ttl: 0,
                    currency: '',
                };
            }
            else {
                //validate input
                if (!validateCheckoutInput(res, input)) {
                    console.log('validation failed');
                    return null;
                }
                //create default output
                const checkoutOutput = {
                    success: false,
                    contractAddress: '0x0DcA1518DB5A058F29EBfDab76739faf8Fb4544c',
                    amount: '0',
                    orderId: '0x',
                    chainId: 11155111,
                    ttl: 0,
                    currency: '',
                };
                //get the client
                const rc = await RelayClientWrapper.get(ENDPOINT, input.storeId, input.keycard);
                //do the full checkout
                if (rc) {
                    const cartId = await rc.createCart();
                    console.log('CART ID: ', cartId);
                    //add products to cart
                    for (const item of input.items) {
                        await rc.addToCart(cartId, item.productId, //'0xa3438104c764746a3d67c761e154ad26a958153743e97db10747121d4c68d642'
                        item.quantity);
                    }
                    //commit cart
                    if (isZeroAddress(input.paymentCurrency))
                        input.paymentCurrency = undefined;
                    await rc.commitCart(cartId, input.paymentCurrency);
                    const event = await rc.getCartFinalizedEvent(cartId);
                    checkoutOutput.orderId = keccak256(event.cartId);
                    checkoutOutput.ttl = event.paymentTtl;
                    checkoutOutput.amount = event.totalInCrypto;
                    checkoutOutput.currency = input.paymentCurrency ?? '';
                    checkoutOutput.success = true;
                    output = checkoutOutput;
                }
            }
            console.log('returning output', output);
            return output;
        }, 200);
    },
};
function validateCheckoutInput(res, input) {
    if (!validateStoreIdAndKeycard(res, input))
        return false;
    if (!input.items || !input.items.length) {
        console.log('items missing');
        //res.status(400).json({
        //    msg: 'Required: items',
        //});
        return false;
    }
    return true;
}
//# sourceMappingURL=checkout.js.map