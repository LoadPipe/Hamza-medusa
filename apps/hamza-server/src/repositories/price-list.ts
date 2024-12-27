import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { PriceListRepository as MedusaPriceListRepository } from '@medusajs/medusa/dist/repositories/price-list';
import { PriceList } from '@medusajs/medusa';

export const PriceListRepository = dataSource.getRepository(PriceList).extend({
    ...Object.assign(MedusaPriceListRepository, {
        target: PriceList,
    }),
});

export default PriceListRepository;
