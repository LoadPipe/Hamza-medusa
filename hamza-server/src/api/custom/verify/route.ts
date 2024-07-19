import { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { SiweMessage } from 'siwe';
import CustomerRepository from '../../../repositories/customer';
import AuthService from '../../../../src/services/auth';
import CustomerService from '../../../../src/services/customer';
import CustomerWalletAddressRepository from '../../../repositories/customer-wallet-address';
import { Customer } from 'src/models/customer';
import { WhiteListRepository } from '../../../repositories/whitelist';
import { RouteHandler } from '../../route-handler';
// Using Auth from SIWE example: https://github.com/spruceid/siwe-quickstart/blob/main/02_backend/src/index.js

// TODO: So once the user has been verified, we can use the CustomerService.create() method to create/login the user.

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerService: CustomerService =
        req.scope.resolve('customerService');
    const authService: AuthService = req.scope.resolve('authService');

    const handler = new RouteHandler(
        req, res, 'POST', '/custom/verify', ['message', 'signature',]
    );

    await handler.handle(async () => {
        //get the service instances
        let created = false;

        const { message, signature } = handler.inputParams;

        const wallet_address = message.address;

        let checkCustomerWithWalletAddress =
            await CustomerWalletAddressRepository.findOne({
                where: { wallet_address: wallet_address },
                relations: { customer: { preferred_currency: true } },
            });

        //create customer input data
        const customerInputData = {
            email: `${checkCustomerWithWalletAddress && checkCustomerWithWalletAddress.customer ? checkCustomerWithWalletAddress.customer.email : `${wallet_address}@evm.blockchain`}`,
            first_name: 'Anonymous',
            last_name: 'Gigachad',
            password: 'password', //TODO: (JK) store the default password someplace
            wallet_address: wallet_address,
        };

        handler.logger.debug('customer input is ' + customerInputData);
        //verify the signature
        const siweMessage = new SiweMessage(message);
        let siweResponse = await siweMessage.verify({ signature });
        handler.logger.debug('siwe response is ' + siweResponse);
        if (!siweResponse.success) {
            throw new Error('Error in validating wallet address signature');
        }

        handler.logger.debug('customer data is ' + checkCustomerWithWalletAddress);
        let newCustomerData: Customer;
        if (!checkCustomerWithWalletAddress) {
            handler.logger.debug('creating new customer ');
            await customerService.create(customerInputData);
            newCustomerData = await CustomerRepository.findOne({
                where: { email: customerInputData.email.toLowerCase() },
                relations: { preferred_currency: true },
            });
            created = true;
        } else {
            //if customer record exists, authenticate the user
            let authResult = await authService.authenticateCustomer(
                customerInputData.email.toLowerCase(),
                customerInputData.password,
                customerInputData.wallet_address
            );
            handler.logger.debug('auth result is ' + authResult);
            if (!authResult.success) {
                throw new Error('Error in verifying email and password');
            }
        }

        let whitelistStatus = await WhiteListRepository.find({
            where: { wallet_address: customerInputData.wallet_address },
        });
        handler.logger.debug('whitelist status is ' + whitelistStatus);

        let body = {
            customer_id:
                checkCustomerWithWalletAddress &&
                checkCustomerWithWalletAddress.customer &&
                checkCustomerWithWalletAddress.customer.id,
            preferred_currency:
                checkCustomerWithWalletAddress &&
                checkCustomerWithWalletAddress.customer &&
                checkCustomerWithWalletAddress.customer.preferred_currency,
            email: customerInputData.email,
            created,
            is_verified:
                checkCustomerWithWalletAddress &&
                checkCustomerWithWalletAddress.customer &&
                checkCustomerWithWalletAddress.customer.is_verified,
            whitelist_config: {
                is_whitelisted: whitelistStatus.length > 0 ? true : false,
                whitelisted_stores: whitelistStatus.map((a) => a.store_id),
            },
        };
        res.send({ status: true, data: body });
    });
};
