import {
    CustomerService as MedusaCustomerService,
    Logger,
} from '@medusajs/medusa';
import { CreateCustomerInput } from '@medusajs/medusa/dist/types/customers';
import { Lifetime } from 'awilix';
import { CustomerRepository } from '../repositories/customer';
import CustomerWalletAddressRepository from '../repositories/customer-wallet-address';
import { createLogger, ILogger } from '../utils/logging/logger';
import CustomerNotificationService from './customer-notification';

interface CustomCustomerInput extends CreateCustomerInput {
    wallet_address: string;
}

export default class CustomerService extends MedusaCustomerService {
    static LIFE_TIME = Lifetime.SINGLETON; // default, but just to show how to change it

    protected customerRepository_: typeof CustomerRepository;
    protected customerNotificationService_: CustomerNotificationService;
    protected logger: ILogger;

    constructor(container) {
        super(container);
        this.customerRepository_ = container.customerRepository;
        this.customerNotificationService_ = container.customerNotificationService;
        this.logger = createLogger(container, 'CustomerService');
    }

    async create(input: CustomCustomerInput): Promise<any> {
        this.logger.debug(
            `CustomerService.create() method running with input; ${input}`
        );

        if (input?.wallet_address)
            input.wallet_address = input.wallet_address.trim().toLowerCase();

        if (input?.email)
            input.email = input.email.trim().toLowerCase();

        let existingWalletAddress =
            await CustomerWalletAddressRepository.findOne({
                where: { wallet_address: input.wallet_address },
                relations: { customer: { preferred_currency: true } },
                select: { wallet_address: true },
            });

        if (existingWalletAddress) {
            this.logger.debug(
                `Customer with wallet address ${input.wallet_address} already exists`
            );
            return {
                customer: existingWalletAddress.customer,
                customerWalletAddress: existingWalletAddress,
                customerPreferredCurrency:
                    existingWalletAddress.customer.preferred_currency,
            };
        } else {
            this.logger.debug(
                `Customer with wallet address ${input.wallet_address} not found`
            );
        }
        this.logger.debug(
            `creating Customer with input ${JSON.stringify(input)}`
        );

        try {
            //create customer
            const _customer: any = await super.create(input);

            //save customer wallet 
            const _customerWalletAddress =
                await CustomerWalletAddressRepository.save({
                    customer: { id: _customer.id },
                    wallet_address: input.wallet_address,
                });

            //save preferred currency 
            let _customerPreferredCurrency =
                await this.customerRepository_.findOne({
                    where: { id: _customer.id },
                    relations: { preferred_currency: true },
                    select: { id: true },
                });

            //set default notification types 
            this.customerNotificationService_.setDefaultNotifications(_customer.id);

            this.logger.debug(
                `Extending Customer with wallet address: ${_customer.wallet_address}`
            );
            return {
                customer: _customer,
                customerWalletAddress: _customerWalletAddress,
                customerPreferredCurrency:
                    _customerPreferredCurrency.preferred_currency,
            };
        } catch (e) {
            this.logger.error(`Error creating customer: ${e}`);
        }
        // lets add a try catch for actually creating a customer?
    }

    async updateCurrency(customerId: string, currency: string): Promise<any> {
        this.logger.debug('CustomerService UpdateCurrency method running');
        let customer = await this.customerRepository_.findOne({
            where: { id: customerId },
            select: { id: true },
        });
        if (!customer) {
            this.logger.debug(`Customer with id ${customerId} not found`);
            return null;
        }
        this.logger.debug(`Customer Selected ${JSON.stringify(customer)}`);
        try {
            let updatedCustomer = await this.customerRepository_.save({
                ...customer,
                preferred_currency_id: currency,
            });
            this.logger.debug(
                `Customer with id ${currency} updated with currency ID ${currency}`
            );
            return updatedCustomer;
        } catch (e) {
            this.logger.error(`Error updating customer currency: ${e}`);
            throw e; // It might be helpful to rethrow the error for further handling by the caller.
        }
    }

    async getCustomerCurrency(customerId: string): Promise<any> {
        this.logger.debug('CustomerService getCustomerCurrency method running');

        // Find the customer by ID
        let customer = await this.customerRepository_.findOne({
            where: { id: customerId },
            select: { preferred_currency_id: true },
        });

        // Check if the customer exists
        if (!customer) {
            this.logger.debug(`Customer with id ${customerId} not found`);
            return null;
        }

        this.logger.debug(`Customer Selected ${JSON.stringify(customer)}`);

        // Return the preferred currency ID
        try {
            const currency = customer.preferred_currency_id;
            this.logger.debug(
                `Customer with id ${customerId} has preferred currency ID ${currency}`
            );
            return currency;
        } catch (e) {
            this.logger.error(`Error retrieving customer currency: ${e}`);
            throw e; // Rethrow the error for further handling by the caller.
        }
    }

    async isVerified(customer_id) {
        const customer = await this.customerRepository_.findOne({
            where: { id: customer_id },
        });
        if (!customer) {
            throw new Error('Customer not found');
        }
        this.logger.debug(`Customer Email is: ${customer.email}`);

        // Returns true if the email does NOT include '@evm.blockchain'
        return customer.email.includes('@evm.blockchain');
    }
}
