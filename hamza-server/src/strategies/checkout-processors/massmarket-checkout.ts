import { BasicCheckoutProcessor, IPaymentGroupData } from './basic-checkout';
import { Order } from '../../models/order';
import { Product } from '../../models/product';
import {
    CheckoutOutput,
    MassMarketClient,
} from '../../massmarket-client/rest-client';
import { In } from 'typeorm';
import { getCurrencyAddress } from '../../currency.config';

type HexString = `0x${string}`;

//TODO: this should actually be a global util
function stringToHex(input: string): HexString {
    const hexString = input.startsWith('0x') ? input.substring(2) : input;
    return `0x${hexString}`;
}

type CheckoutResult = CheckoutOutput & { medusaOrderId: string };

/**
 * Does massmarket checkout; extends BasicCheckout and adds some stuff of its own that is 
 * specific to Massmarket.
 */
class MassMarketCheckoutProcessor extends BasicCheckoutProcessor {

    constructor(container) {
        super(container);
    }

    protected async doMassMarketCheckouts(
        storeGroups: IPaymentGroupData[],
        orders: Order[]
    ): Promise<CheckoutResult[]> {
        this.logger.debug(`prepping ${orders.length} orders for checkout`);
        try {
            //prepare each order for checkout
            for (let n = 0; n < orders.length; n++) {
                const order = orders[n];
                let lineItems = storeGroups[n].items;

                //TODO: is this necessary?
                lineItems = await this.lineItemRepository.find({
                    where: { id: In(lineItems.map((i) => i.id)) },
                    relations: ['variant.product', 'order'],
                });

                //TODO: is this necessary?
                orders = await this.orderRepository.find({
                    where: { id: In(orders.map((o) => o.id)) },
                    relations: ['store'],
                });
            }
        } catch (e) {
            this.logger.error(`Error ${e}`);
        }
        this.logger.debug('prepped orders for checkout');

        //call checkout for each store
        const client = new MassMarketClient();
        const output: CheckoutResult[] = [];
        for (let n = 0; n < storeGroups.length; n++) {
            const group = storeGroups[n];

            //create the input for checkout, for each store group
            const checkoutInputs = [];
            for (const item of group.items) {
                const prod: Product = item.variant.product;

                if (prod.massmarket_prod_id?.length) {
                    checkoutInputs.push({
                        productId: prod.massmarket_prod_id,
                        quantity: item.quantity,
                    });
                }
            }

            //get payment currency address
            let currencyAddress = getCurrencyAddress(
                group.currency_code,
                11155111
            );
            if (currencyAddress) {
                if (currencyAddress === '0x0' || currencyAddress === '')
                    currencyAddress = undefined;
            }
            //massmarket checkout for a store group
            const checkout = await client.checkout(
                stringToHex(group.store?.massmarket_store_id),
                stringToHex(group.store?.massmarket_keycard),
                currencyAddress,
                checkoutInputs
            );

            this.logger.debug(
                'got checkout results:' + JSON.stringify(checkout)
            );
            this.logger.debug(orders.length);

            //save the output
            output.push({
                ...checkout,
                medusaOrderId: orders[n].id,
            });
        }

        return output;
    }

    protected async updateOrderForMassMarket(checkoutResults: CheckoutResult[]) {
        const promises: Promise<Order>[] = [];
        for (const r of checkoutResults) {
            this.logger.debug(
                'saving order ' + r.paymentId + ', ' + r.medusaOrderId
            );
            promises.push(
                this.orderRepository.save({
                    id: r.medusaOrderId,
                    massmarket_order_id: r.orderHash,
                    massmarket_ttl: r.ttl,
                    massmarket_amount: r.amount,
                })
            );
        }

        this.logger.debug('saving the orders from checkout...');
        await Promise.all(promises);
        this.logger.debug('...saved the orders from checkout');
    }

    protected async doCheckoutSteps(): Promise<void> {

        super.doCheckoutSteps();

        //save/update payments with order ids
        await this.updatePaymentFromOrder(this.payments, this.orders);

        //send checkout to massmarket stores
        //TODO: be able to handle one store checkout failure, while the other succeed
        const checkoutResults: CheckoutResult[] =
            await this.doMassMarketCheckouts(this.paymentGroups, this.orders);

        this.logger.debug(
            `Got checkout results ${JSON.stringify(checkoutResults)}`
        );

        //update the order with massmarket-specific stuff
        await this.updateOrderForMassMarket(checkoutResults);
    }
}


export default MassMarketCheckoutProcessor;
