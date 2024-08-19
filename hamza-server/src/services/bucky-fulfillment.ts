import { AbstractFulfillmentService, Cart, Fulfillment, LineItem, Order } from "@medusajs/medusa"
import { CreateReturnType } from "@medusajs/medusa/dist/types/fulfillment-provider";

class BuckyFulfillmentService extends AbstractFulfillmentService {
    static identifier = "my-fulfillment";

    constructor(container, options) {
        super(container)
        // you can access options here

        // you can also initialize a client that
        // communicates with a third-party service.
    }

    async getFulfillmentOptions(): Promise<any[]> {
        return [
            {
                id: "bucky-fulfillment",
            },
            {
                id: "bucky-fulfillment-dynamic",
            },
        ]
    }

    async validateFulfillmentData(
        optionData: Record<string, unknown>,
        data: Record<string, unknown>,
        cart: Cart
    ): Promise<Record<string, unknown>> {
        if (data.id !== "my-fulfillment") {
            throw new Error("invalid data")
        }

        return {
            ...data,
        }
    }

    async calculatePrice(optionData: { [x: string]: unknown; }, data: { [x: string]: unknown; }, cart: Cart): Promise<number> {
        return 10;
    }

    async canCalculate(data: { [x: string]: unknown; }): Promise<boolean> {
        return true;
    }

    async validateOption(data: { [x: string]: unknown; }): Promise<boolean> {
        return true;
    }

    async createFulfillment(data: { [x: string]: unknown; }, items: LineItem[], order: Order, fulfillment: Fulfillment): Promise<{ [x: string]: unknown; }> {

        return null;
    }

    async cancelFulfillment(fulfillment: { [x: string]: unknown; }): Promise<any> {
        return null;
    }

    async createReturn(returnOrder: CreateReturnType): Promise<Record<string, unknown>> {
        return null;
    }

    async getFulfillmentDocuments(data: { [x: string]: unknown; }): Promise<any> {

        return null;
    }

    async retrieveDocuments(fulfillmentData: Record<string, unknown>, documentType: "invoice" | "label"): Promise<any> {

        return null;
    }

    async getReturnDocuments(data: Record<string, unknown>): Promise<any> {
        return null;
    }

    async getShipmentDocuments(data: Record<string, unknown>): Promise<any> {
        return null;
    }
}

export default BuckyFulfillmentService