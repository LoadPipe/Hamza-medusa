import {
    AbstractCartCompletionStrategy,
    CartCompletionResponse,
    IdempotencyKey,
    IdempotencyKeyService,
    ProductService,
    CartService,
    Logger,
} from '@medusajs/medusa';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import LineItemRepository from '@medusajs/medusa/dist/repositories/line-item';
import MassMarketCartStrategy from './checkout-processors/massmarket-cart';
import OrderService from '../services/order';
import { PaymentService } from '@medusajs/medusa/dist/services';
import { RequestContext } from '@medusajs/medusa/dist/types/request';
import PaymentRepository from '@medusajs/medusa/dist/repositories/payment';
import { Config } from '../config';
import SwitchCheckoutProcessor from './checkout-processors/switch-checkout';
import FakeCheckoutProcessor from './checkout-processors/fake-checkout';

type InjectedDependencies = {
    idempotencyKeyService: IdempotencyKeyService;
    productService: ProductService;
    paymentService: PaymentService;
    cartService: CartService;
    orderService: OrderService;
    paymentRepository: typeof PaymentRepository;
    orderRepository: typeof OrderRepository;
    lineItemRepository: typeof LineItemRepository;
    logger: Logger;
};

class CartCompletionStrategy extends AbstractCartCompletionStrategy {
    protected readonly idempotencyKeyService: IdempotencyKeyService;
    protected readonly cartService: CartService;
    protected readonly productService: ProductService;
    protected readonly paymentService: PaymentService;
    protected readonly orderService: OrderService;
    protected readonly paymentRepository: typeof PaymentRepository;
    protected readonly orderRepository: typeof OrderRepository;
    protected readonly lineItemRepository: typeof LineItemRepository;
    protected readonly logger: Logger;
    private massMarketStrategy: MassMarketCartStrategy;
    private switchProcessor: SwitchCheckoutProcessor;
    private fakeProcessor: FakeCheckoutProcessor;

    constructor(deps: InjectedDependencies) {
        super(deps); // Call the superclass constructor if needed and pass any required parameters explicitly if it requires any.

        // Assuming both strategies need the same dependencies as this class, pass them directly.
        this.massMarketStrategy = new MassMarketCartStrategy(deps);
        this.switchProcessor = new SwitchCheckoutProcessor(deps);
        this.fakeProcessor = new FakeCheckoutProcessor(deps);

        // Initialize all services and repositories provided in deps directly
        this.idempotencyKeyService = deps.idempotencyKeyService;
        this.cartService = deps.cartService;
        this.paymentService = deps.paymentService;
        this.productService = deps.productService;
        this.orderService = deps.orderService;
        this.paymentRepository = deps.paymentRepository;
        this.orderRepository = deps.orderRepository;
        this.lineItemRepository = deps.lineItemRepository;
        this.logger = deps.logger;
    }

    async complete(
        cartId: string,
        idempotencyKey: IdempotencyKey,
        context: RequestContext
    ): Promise<CartCompletionResponse> {
        const paymentMode = 'FAKE'; //Config.getPaymentMode();
        this.logger.debug(`CartCompletionStrategy: payment mode is ${paymentMode}`);

        switch (paymentMode) {
            case 'MASSMARKET':
                return await this.massMarketStrategy.complete(
                    cartId
                );

            case 'SWITCH':
                return await this.switchProcessor.complete(
                    cartId
                );
            default:
                'FAKE';
                return await this.fakeProcessor.complete(
                    cartId
                );
        }
    }
}

export default CartCompletionStrategy;
