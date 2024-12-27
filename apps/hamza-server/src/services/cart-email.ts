import {
    TransactionBaseService,
    CartService,
} from '@medusajs/medusa';
import { createLogger, ILogger } from '../utils/logging/logger';
import { CartEmailRepository } from '../repositories/cart-email';

export default class CartEmailService extends TransactionBaseService {
    protected readonly logger: ILogger;
    protected readonly cartService_: CartService;
    protected readonly cartEmailRepository: typeof CartEmailRepository;

    constructor(container) {
        super(container);
        this.cartService_ = container.cartService;
        this.logger = createLogger(container, 'CartEmailService');
        this.cartEmailRepository = container.cartEmailRepository;
    }

    async setCartEmail(cart_id: string, email_address: string): Promise<void> {
        await this.cartEmailRepository.save({ id: cart_id, email_address })
    }

    async getCartEmail(cart_id: string): Promise<string> {
        const record = await this.cartEmailRepository.findOne({ where: { id: cart_id } });
        return record?.email_address;
    }
}
