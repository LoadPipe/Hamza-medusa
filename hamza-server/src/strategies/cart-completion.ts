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
import OrderService from '../services/order';
import { PaymentService } from '@medusajs/medusa/dist/services';
import { RequestContext } from '@medusajs/medusa/dist/types/request';
import PaymentRepository from '@medusajs/medusa/dist/repositories/payment';
import { Config } from '../config';
import SwitchCheckoutProcessor from './checkout-processors/switch-checkout';
import { BasicCheckoutProcessor } from './checkout-processors/basic-checkout';
import MassMarketCheckoutProcessor from './checkout-processors/massmarket-checkout';
import { createLogger, ILogger } from '../utils/logging/logger';

type InjectedDependencies = {
    idempotencyKeyService: IdempotencyKeyService;
    productService: ProductService;
    paymentService: PaymentService;
    cartService: CartService;
    orderService: OrderService;
    paymentRepository: typeof PaymentRepository;
    orderRepository: typeof OrderRepository;
    lineItemRepository: typeof LineItemRepository;
    logger: ILogger;
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
    protected readonly logger: ILogger;
    private massMarketProcessor: MassMarketCheckoutProcessor;
    private switchProcessor: SwitchCheckoutProcessor;
    private basicProcessor: BasicCheckoutProcessor;

    constructor(deps: InjectedDependencies) {
        super(deps); // Call the superclass constructor if needed and pass any required parameters explicitly if it requires any.

        // Assuming both strategies need the same dependencies as this class, pass them directly.
        this.massMarketProcessor = new MassMarketCheckoutProcessor(deps);
        this.switchProcessor = new SwitchCheckoutProcessor(deps);
        this.basicProcessor = new BasicCheckoutProcessor(deps);

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
        const checkoutMode = Config.checkoutMode;
        this.logger.debug(`CartCompletionStrategy: payment mode is ${checkoutMode}`);

        switch (checkoutMode) {
            case 'MASSMARKET':
                return await this.massMarketProcessor.complete(
                    cartId
                );

            case 'SWITCH':
                return await this.switchProcessor.complete(
                    cartId
                );
            case 'DIRECT':
                return await this.basicProcessor.complete(
                    cartId
                );
            default:
                'FAKE';
                return await this.basicProcessor.complete(
                    cartId
                );
        }
    }
}

export default CartCompletionStrategy;
