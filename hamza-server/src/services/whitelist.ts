import { TransactionBaseService, Logger } from '@medusajs/medusa';
import ConfirmationTokenRepository from '../repositories/confirmation-token';
import CustomerRepository from '../repositories/customer';
import moment from 'moment';
import { ethers } from 'ethers';
import SmtpMailService from './smtp-mail';
import dotenv from 'dotenv';
import { WhiteListRepository } from '..//repositories/whitelist';
dotenv.config();

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

    async create(store_id: string, wallet_address: string) {
        return await this.whitelistRepository_.save({
            store_id,
            wallet_address,
        });
    }

    async remove(store_id: string, wallet_address: string) {
        await this.whitelistRepository_.delete({ store_id, wallet_address });
        return;
    }
}
