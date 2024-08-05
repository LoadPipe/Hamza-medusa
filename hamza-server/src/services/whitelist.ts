import { TransactionBaseService, Logger } from '@medusajs/medusa';
import CustomerRepository from '../repositories/customer';
import { WhiteListRepository } from '../repositories/whitelist';
import { WhiteList } from '../models/whitelist';


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
        return await this.whitelistRepository_.save({
            store_id: storeId,
            wallet_address: walletAddress
        });
    }

    async remove(storeId: string, walletAddress: string) {
        await this.whitelistRepository_.delete({
            store_id: storeId,
            wallet_address: walletAddress
        });
        return;
    }

    async getByStore(storeId: string, walletAddress: string) {
        const whitelist = await this.whitelistRepository_.findOne({
            where: {
                store_id: storeId,
                wallet_address: walletAddress
            },
            relations: ['customers']
        });
    }
}
