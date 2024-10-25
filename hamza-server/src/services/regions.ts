import { Lifetime } from 'awilix';
import {
    RegionService as MedusaRegionService,
    Store,
    Logger,
    FindConfig,
    Region,
    Selector,
    Country,
} from '@medusajs/medusa';
import { User } from '../models/user';
import StoreRepository from '../repositories/store';
import axios from 'axios';
import { UpdateStoreInput as MedusaUpdateStoreInput } from '@medusajs/medusa/dist/types/store';
import { UpdateProductInput as MedusaUpdateProductInput } from '@medusajs/medusa/dist/types/product';
import ProductRepository from '@medusajs/medusa/dist/repositories/product';
import { createLogger, ILogger } from '../utils/logging/logger';
import { IsNull, Not } from 'typeorm';
import RegionRepository from '@medusajs/medusa/dist/repositories/region';


class RegionService extends MedusaRegionService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly logger: ILogger;

    constructor(container) {
        super(container);
        this.logger = createLogger(container, 'RegionService');
    }

    async retrieve(regionId: string, config?: FindConfig<Region>): Promise<Region | never> {
        return super.retrieve(regionId, config);
    }

    async retrieveByCountryCode(code: Country['iso_2'], config?: FindConfig<Region>): Promise<Region | never> {
        return super.retrieve(code, config);
    }

    async list(selector?: Selector<Region>, config?: FindConfig<Region>): Promise<Region[]> {
        const regions = await super.list(selector, config);
        for (let r of regions) {
            r.countries = r.countries.filter(c => c.iso_2 != 'en')
        }
        return regions;
    }

    async listAndCount(selector?: Selector<Region> & { q?: string; }, config?: FindConfig<Region>): Promise<[Region[], number]> {
        return super.listAndCount(selector, config);
    }
}

export default RegionService;
