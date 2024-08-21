import { AbstractFulfillmentService, Cart, Fulfillment, LineItem, Order } from "@medusajs/medusa"
import { CreateReturnType } from "@medusajs/medusa/dist/types/fulfillment-provider";
import BuckydropService from "./buckydrop";

class BuckyFulfillmentService extends AbstractFulfillmentService {
    static identifier = "bucky-fulfillment";
    protected readonly buckyService: BuckydropService;

    constructor(container, options) {
        super(container);
        this.buckyService = container.buckydropService;
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
        console.log("*************************** validateFulfillmentData *************************")
        console.log({
            data,
            optionData
        });
        if (optionData.id !== "bucky-fulfillment") {
            throw new Error("invalid data")
        }

        return {
            ...data,
        }
    }

    async calculatePrice(optionData: { [x: string]: unknown; }, data: { [x: string]: unknown; }, cart: Cart): Promise<number> {

        console.log("*************************** calculatePrice *************************")
        if (data.id !== "bucky-fulfillment") {
            throw new Error("invalid data")
        }
        console.log(optionData);
        console.log(data);

        return await this.buckyService.calculateShippingPriceForCart(cart.id);
    }

    async canCalculate(data: { [x: string]: unknown; }): Promise<boolean> {
        console.log("*************************** canCalculate *************************")
        return true;
    }

    async validateOption(data: { [x: string]: unknown; }): Promise<boolean> {
        console.log("*************************** validateOption *************************")
        return true;
    }

    async createFulfillment(data: { [x: string]: unknown; }, items: LineItem[], order: Order, fulfillment: Fulfillment): Promise<{ [x: string]: unknown; }> {

        console.log("*************************** createFulfillment *************************")
        return null;
    }

    async cancelFulfillment(fulfillment: { [x: string]: unknown; }): Promise<any> {
        console.log("*************************** cancelFulfillment *************************")
        return null;
    }

    async createReturn(returnOrder: CreateReturnType): Promise<Record<string, unknown>> {
        console.log("*************************** createReturn *************************")
        return null;
    }

    async getFulfillmentDocuments(data: { [x: string]: unknown; }): Promise<any> {
        console.log("*************************** getFulfillmentDocuments *************************")
        return null;
    }

    async retrieveDocuments(fulfillmentData: Record<string, unknown>, documentType: "invoice" | "label"): Promise<any> {

        console.log("*************************** retrieveDocuments *************************")
        return null;
    }

    async getReturnDocuments(data: Record<string, unknown>): Promise<any> {
        console.log("*************************** getReturnDocuments *************************")
        return null;
    }

    async getShipmentDocuments(data: Record<string, unknown>): Promise<any> {
        console.log("*************************** getShipmentDocuments *************************")
        return null;
    }
}

export default BuckyFulfillmentService