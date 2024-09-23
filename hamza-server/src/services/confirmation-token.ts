import {
    TransactionBaseService,
    Logger,
    EventBusService,
} from '@medusajs/medusa';
import ConfirmationTokenRepository from '../repositories/confirmation-token';
import CustomerRepository from '../repositories/customer';
import moment from 'moment';
import { ethers } from 'ethers';
import SmtpMailService from './smtp-mail';
import dotenv from 'dotenv';
import { createLogger, ILogger } from '../utils/logging/logger';
import { ConfirmationToken } from 'src/models/confirmation-token';
dotenv.config();

export default class ConfirmationTokenService extends TransactionBaseService {
    protected readonly confirmationTokenRepository_: typeof ConfirmationTokenRepository;
    protected readonly customerRepository_: typeof CustomerRepository;
    protected readonly logger: ILogger;
    protected readonly eventBus_: EventBusService;

    constructor(container) {
        super(container);
        this.confirmationTokenRepository_ = ConfirmationTokenRepository;
        this.customerRepository_ = CustomerRepository;
        this.logger = createLogger(container, 'ConfirmationTokenService');
        this.eventBus_ = container.eventBusService;
    }

    async createConfirmationToken({
        customer_id,
        email,
    }: {
        customer_id: string;
        email: string;
    }) {
        let emailCheck = await this.customerRepository_.findOne({
            where: { email: email },
        });
        if (emailCheck) {
            throw new Error('Email already associated with different account');
        }

        let token = ethers.keccak256(ethers.randomBytes(32));

        this.logger.debug('token is ' + token);
        let confirmationToken = await this.confirmationTokenRepository_.save({
            id: token,
            customer: { id: customer_id },
            email_address: email,
            token: token,
        });
        //sending email
        let smtpService = new SmtpMailService();
        await smtpService.sendMail({
            from: process.env.SMTP_FROM,
            subject: 'Email Verification',
            templateName: 'verify-email',
            to: email,
            mailData: {
                url: `${process.env.STORE_URL}/verify-confirmation-token/${token}`,
            },
        });

        return;
    }

    async getConfirmationToken(token: string): Promise<ConfirmationToken> {
        return await this.confirmationTokenRepository_.findOne({
            where: { token: token },
        });
    }

    async verifyConfirmationToken(token: string) {
        let tokenCheck = await this.confirmationTokenRepository_.findOne({
            where: { token: token },
        });

        //check for existence of token
        if (!tokenCheck) {
            throw new Error('Token not found');
        }

        //check if already used
        if (tokenCheck.redeemed) {
            throw new Error('Token redeemed already');
        }

        //check for token expiration
        if (
            moment().diff(tokenCheck.created_at, 'hour') >
            tokenCheck.expiration_hours
        ) {
            throw new Error('Token Expired');
        }

        //get the customer & verify
        let customerData = await this.customerRepository_.findOne({
            where: { id: tokenCheck.customer_id },
            relations: { walletAddresses: true },
        });
        if (customerData.walletAddresses.length == 0) {
            throw new Error('Please link a wallet before email verification');
        }

        //update customer record
        await this.customerRepository_.update(
            { id: customerData.id },
            { is_verified: true, email: tokenCheck.email_address }
        );
        await this.confirmationTokenRepository_.update(
            { token: tokenCheck.token },
            { redeemed: true }
        );

        //sending email for the confirmation
        await this.eventBus_.emit([
            {
                data: { email: tokenCheck.email_address, id: customerData.id },
                eventName: 'customer.verified',
            },
        ]);
    }
}
