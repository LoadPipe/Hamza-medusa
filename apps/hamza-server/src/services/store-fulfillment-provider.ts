import {
    AbstractFulfillmentService,
    Cart,
    Fulfillment,
    LineItem,
    Order,
} from '@medusajs/medusa';
import { CreateReturnType } from '@medusajs/medusa/dist/types/fulfillment-provider';
import StoreShippingSpecService from './store-shipping-spec';

class StoreFulfillmentService extends AbstractFulfillmentService {
    protected readonly shippingSpecService: StoreShippingSpecService;
    static identifier: string = 'store-fulfillment';

    constructor(container, options) {
        super(container);
        this.shippingSpecService = container.storeShippingSpecService;
    }

    async getFulfillmentOptions(): Promise<any[]> {
        return [
            {
                id: 'store-fulfillment',
            },
        ];
    }

    async validateFulfillmentData(
        optionData: Record<string, unknown>,
        data: Record<string, unknown>,
        cart: Cart
    ): Promise<Record<string, unknown>> {
        if (
            data.id !== StoreFulfillmentService.identifier &&
            optionData.id !== StoreFulfillmentService.identifier
        ) {
            throw new Error(`${optionData.id} invalid option id`);
        }

        return {
            ...data,
        };
    }

    async calculatePrice(
        optionData: { [x: string]: unknown },
        data: { [x: string]: unknown },
        cart: Cart
    ): Promise<number> {
        if (
            data.id !== StoreFulfillmentService.identifier &&
            optionData.id !== StoreFulfillmentService.identifier
        ) {
            throw new Error(`${optionData.id} invalid option id`);
        }

        return await this.shippingSpecService.calculateShippingPriceForCart(
            cart.id
        );
    }

    async canCalculate(data: { [x: string]: unknown }): Promise<boolean> {
        return data.id === StoreFulfillmentService.identifier;
    }

    async validateOption(data: { [x: string]: unknown }): Promise<boolean> {
        return true;
    }

    async createFulfillment(
        data: { [x: string]: unknown },
        items: LineItem[],
        order: Order,
        fulfillment: Fulfillment
    ): Promise<{ [x: string]: unknown }> {
        return null;
    }

    async cancelFulfillment(fulfillment: {
        [x: string]: unknown;
    }): Promise<any> {
        return null;
    }

    async createReturn(
        returnOrder: CreateReturnType
    ): Promise<Record<string, unknown>> {
        return null;
    }

    async getFulfillmentDocuments(data: {
        [x: string]: unknown;
    }): Promise<any> {
        return null;
    }

    async retrieveDocuments(
        fulfillmentData: Record<string, unknown>,
        documentType: 'invoice' | 'label'
    ): Promise<any> {
        return null;
    }

    async getReturnDocuments(data: Record<string, unknown>): Promise<any> {
        return null;
    }

    async getShipmentDocuments(data: Record<string, unknown>): Promise<any> {
        return null;
    }
}

export default StoreFulfillmentService;
