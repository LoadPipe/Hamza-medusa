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
import * as process from 'node:process';
import MassMarketCartCompletionStrategy from './checkout/massmarket-cart-completion';
import SwitchCartCompletionStrategy from './checkout/switch-cart-completion';
import OrderService from '../services/order';
import { PaymentService } from '@medusajs/medusa/dist/services';
import { RequestContext } from '@medusajs/medusa/dist/types/request';
import PaymentRepository from '@medusajs/medusa/dist/repositories/payment';

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
    private massMarketStrategy: MassMarketCartCompletionStrategy;
    private switchStrategy: SwitchCartCompletionStrategy;

    constructor(deps: InjectedDependencies) {
        super(deps); // Call the superclass constructor if needed and pass any required parameters explicitly if it requires any.

        // Assuming both strategies need the same dependencies as this class, pass them directly.
        this.massMarketStrategy = new MassMarketCartCompletionStrategy(deps);
        this.switchStrategy = new SwitchCartCompletionStrategy(deps);

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
        switch (process.env.MASSMARKET_THING) {
            case 'MASSMARKET':
                return await this.massMarketStrategy.complete(
                    cartId,
                    idempotencyKey,
                    context
                );

            case 'SWITCH':
                return await this.switchStrategy.complete(
                    cartId,
                    idempotencyKey,
                    context
                );
        }

        return await this.switchStrategy.complete(
            cartId,
            idempotencyKey,
            context
        );
    }
}

export default CartCompletionStrategy;
