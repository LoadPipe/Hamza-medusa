import { In, UpdateResult } from 'typeorm';
import {
    Discount,
    DiscountService as MedusaDiscountService,
    Logger,
} from '@medusajs/medusa';
import { DiscountRepository } from '../../src/repositories/discount';
import {
    CreateDiscountInput,
    UpdateDiscountInput,
} from '@medusajs/medusa/dist/types/discount';
import { createLogger, ILogger } from '../utils/logging/logger';

type UpdateDiscount = UpdateDiscountInput & {
    store_id?: string;
};

type CreateDiscount = CreateDiscountInput & {
    store_id?: string;
};

export default class DiscountService extends MedusaDiscountService {
    protected readonly discountRepository_: typeof DiscountRepository;
    protected readonly logger: ILogger;

    constructor(container) {
        super(container);
        this.discountRepository_ = container.discountRepository;
        this.logger = createLogger(container, 'DiscountService');
    }

    async update(id: string, input: UpdateDiscount): Promise<Discount> {
        this.logger.debug(`updating product collection ${id}, ${input}`);
        await this.discountRepository_.updateDiscountStore(id, input.store_id);
        return await super.update(id, input);
    }

    async create(discount: CreateDiscount): Promise<Discount> {
        let newDiscount = await this.create(discount);
        await this.discountRepository_.updateDiscountStore(
            newDiscount.id,
            discount.store_id
        );
        return newDiscount;
    }
}
