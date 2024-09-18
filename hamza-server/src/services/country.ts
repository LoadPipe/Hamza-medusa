import { Lifetime } from 'awilix';
import CountryRepository from '@medusajs/medusa/dist/repositories/country';
import RegionRepository from '@medusajs/medusa/dist/repositories/region';
import { TransactionBaseService } from '@medusajs/medusa';
import { createLogger, ILogger } from '../utils/logging/logger';

class CountryService extends TransactionBaseService {
    protected readonly logger: ILogger;
    protected readonly countryRepository_: typeof CountryRepository;
    protected readonly regionRepository_: typeof RegionRepository;

    constructor(container) {
        super(container);
        this.countryRepository_ = container.countryRepository;
        this.regionRepository_ = container.regionRepository;
        this.logger = createLogger('services:country');
    }

    // Lets add a method to add country 'xx'
    async addCountry() {
        try {
            const region = await this.regionRepository_.findOne({
                where: { name: 'NA' },
            });
            if (!region) {
                throw new Error('Region with name NA not found');
            }
            this.logger.info('Attempting to add country with ID 251');
            const payload = {
                id: 251,
                iso_2: 'xx',
                iso_3: 'xxx',
                num_code: 777,
                name: 'X Island',
                display_name: 'Krabi Island',
                region_id: region.id,
            };
            const country = this.countryRepository_.create(payload);

            const saveCountry = await this.countryRepository_.save(country);
            this.logger.info(
                `Country added successfully: ${JSON.stringify(saveCountry)}`
            );
            return saveCountry;
        } catch (error) {
            this.logger.error('Failed to add country:', error);
            throw error;
        }
    }
}

export default CountryService;
