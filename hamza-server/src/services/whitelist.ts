import { TransactionBaseService, Logger, generateEntityId } from '@medusajs/medusa';
import CustomerRepository from '../repositories/customer';
import { WhiteListRepository } from '../repositories/whitelist';
import { WhiteList } from '../models/whitelist';
import { In } from 'typeorm';


export default class WhiteListService extends TransactionBaseService {
    protected readonly customerRepository_: typeof CustomerRepository;
    protected readonly logger: Logger;
    protected readonly whitelistRepository_: typeof WhiteListRepository;

    constructor(container) {
        super(container);
        this.customerRepository_ = CustomerRepository;
        this.whitelistRepository_ = WhiteListRepository;
        this.logger = container.logger;
    }

    async create(storeId: string, walletAddress: string) {
        if (!(await this.getByWalletAddress(storeId, walletAddress))?.length) {
            return await this.whitelistRepository_.save({
                id: generateEntityId(null, 'whitelist'),
                store_id: storeId,
                wallet_address: walletAddress?.trim()?.toLowerCase()
            });
        }
    }

    async remove(storeId: string, walletAddress: string) {
        await this.whitelistRepository_.delete({
            store_id: storeId,
            wallet_address: walletAddress?.trim()?.toLowerCase()
        });
        return;
    }

    async getByCustomerId(storeId: string, customerId: string): Promise<WhiteList[]> {
        this.logger.debug(`getting whitelist ${storeId}, ${customerId}`);
        const customer = await this.customerRepository_.findOne({ where: { id: customerId }, relations: ['walletAddresses'] })

        if (customer && customer.walletAddresses) {
            return await this.whitelistRepository_.find({
                where: {
                    store_id: storeId,
                    wallet_address: In(customer.walletAddresses.map(w => w.wallet_address))
                },
                //relations: ['items']
            });
        }

        return [];
    }

    async getByWalletAddress(storeId: string, walletAddress: string): Promise<WhiteList[]> {
        return await this.whitelistRepository_.find({
            where: {
                store_id: storeId,
                wallet_address: walletAddress?.trim()?.toLowerCase()
            },
            //relations: ['items']
        });

        return [];
    }
}
