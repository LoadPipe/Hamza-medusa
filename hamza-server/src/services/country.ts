import { Lifetime } from 'awilix';
import CountryRepository from '@medusajs/medusa/dist/repositories/country';
import { TransactionBaseService } from '@medusajs/medusa';
import { createLogger, ILogger } from '../utils/logging/logger';

class CountryService extends TransactionBaseService {
    protected readonly logger: ILogger;
    protected readonly countryRepository_: typeof CountryRepository;

    constructor(container) {
        super(container);
        this.countryRepository_ = container.countryRepository;
        this.logger = createLogger('services:country');
    }

    // Lets add a method to add country 'xx'
    async addCountry() {
        try {
            this.logger.info('Attempting to add country with ID 251');
            const payload = {
                id: 251,
                iso_2: 'xx',
                iso_3: 'xxx',
                num_code: 777,
                name: 'X Island',
                display_name: 'Krabi Island',
                region_id: 'reg_01J80KD7EG2VF3FP6PKY1NP80R',
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
