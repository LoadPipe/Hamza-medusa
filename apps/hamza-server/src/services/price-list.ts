import { Lifetime } from 'awilix';
import {
    PriceList,
    PriceListService as MedusaPriceListService,
    Logger,
} from '@medusajs/medusa';
import {
    UpdatePriceListInput as MedusaUpdatePriceListInput,
    CreatePriceListInput as MedusaCreatePriceListInput,
} from '@medusajs/medusa/dist/types/price-list';
import PriceListRepository from '@medusajs/medusa/dist/repositories/price-list';
import { createLogger, ILogger } from '../utils/logging/logger';

type UpdatePriceListInput = MedusaUpdatePriceListInput & {
    store_id?: string;
};

type CreatePriceListInput = MedusaCreatePriceListInput & {
    store_id: string;
};

export default class PriceListService extends MedusaPriceListService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly priceListRepository_: typeof PriceListRepository;
    protected readonly logger: ILogger;

    constructor(container) {
        super(container);
        this.priceListRepository_ = container.priceListRepository;
        this.logger = createLogger(container, 'PriceListService');
    }

    //TODO: any needed functions go here

    async create(input: CreatePriceListInput): Promise<PriceList> {
        this.logger.debug('creating price list ' + input);
        return await this.priceListRepository_.save(input);
    }

    async update(id: string, input: UpdatePriceListInput): Promise<PriceList> {
        return await this.priceListRepository_.save(input);
    }
}
