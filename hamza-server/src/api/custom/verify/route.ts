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

class NewCustomerNames {
    static firstNames = [
        'Anonymous',
        'John',
        'Garo',
        'Jonathan',
        'Gar',
        'Farver',
        'Melchior',
        'Zaaaane',
        'Johnald',
        'Feety',
        'The Buddha',
        'Conan',
        'Bastrick',
        'Weldrick',
        'Javascript',
        'Fleetwoooood',
        'Farhrvenald',
        'Bulbosaur',
        'Captain',
        'Peekachoo',
        "J'Dinklage",
        'Todd-Royal',
        'Hingle',
        'Jackmerius',
        "D'Isaiah",
        "D'Jasper",
        'Caligula',
        'Xmas',
        'Beavis',
        'Ozamatazzz',
        'Beezer',
        'X-Wing',
        'Super Mario',
        'Eeeeeeeeee',
        'Skidooooosh',
        'Torque',
        'Bizmo',
        'Donkeyteeth',
        'Quiznatroid',
        'Bidness',
        'Funkayyyy',
        "D'pez",
        'Slayyyyyyyy',
        'Beeeeg',
        'Quackadilly',
        'Blyrone',
        'Jammie',
        'Hamcorn',
        'Cornelius',
        'Dahistorius',
        "Huka'Lakanaka",
        'Haloopeeeno',
        'Minanas',
        'Ladadadadaladadada',
        'Horsey',
        'Mousecop',
        'Squeeeeeeeeps',
        'A.A.Ron',
        'Firstname',
        "T'Variousness",
        'Juckson',
    ];

    static lastNames = [
        'Gigachad',
        'Kosinski',
        'Nazarian',
        'Bajada',
        'Mnarnar',
        'McZaza',
        'Feetersen',
        'McBoatface',
        'Maguffin',
        'Religion',
        'Stonefist',
        'Barnbarian',
        'Fahhhhrrnald',
        'McMc',
        'Integer',
        'The Mack',
        'Nose',
        'Licktoad',
        'Morgoon',
        'Ahab',
        'Smoochie-Wallace',
        'McKringleberry',
        'Tacktheratrix',
        'Billings-Clyde',
        'Probincrux III',
        'Beavus',
        'Jaxon-Flaxon-Waxon',
        'Hardunkichud',
        'Buckshank',
        'Washingbeard',
        '@aliciousness',
        'Bros',
        'Eeeeeeeeee',
        'Schoishse',
        'Velociraptor',
        'Barsoooom',
        'Construction Noise',
        'Funyuns',
        'Mazimwellious',
        'Skittle',
        'Bidness',
        'Stooooooiuzus',
        'Poopsie',
        'Queeeeeeenn',
        'Boyahhh',
        'Quackadilly',
        'Blashington',
        'Jammi-Jammy',
        'Coooorrrrrnnnius',
        'Chickeninthecorn',
        'Lamystorius',
        'LeMysterioso',
        "Hakanakaheekalucka'hukahakafaka",
        'Dala-dadaladaladalada',
        'Harvard',
        'Balakay',
        'Lastname',
        'Showerhandle',
        'Powercandle',
        'Mascarpone',
        'Grundleplith',
    ];

    public static getRandom(): { first_name: string, last_name: string } {
        const fRand = Math.floor(Math.random() * this.firstNames.length);
        const lRand = Math.floor(Math.random() * this.firstNames.length);

        return {
            first_name: this.firstNames[fRand],
            last_name: this.lastNames[lRand]
        };
    }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerService: CustomerService =
        req.scope.resolve('customerService');
    const authService: AuthService = req.scope.resolve('authService');

    const handler = new RouteHandler(req, res, 'POST', '/custom/verify', [
        'message',
        'signature',
    ]);

    //TODO: this is just a whole entire mess to clean up; business logic in services

    await handler.handle(async () => {
        //get the service instances
        let created = false;

        const { message, signature } = handler.inputParams;

        const wallet_address = message.address?.trim()?.toLowerCase();

        let checkCustomerWithWalletAddress =
            await CustomerWalletAddressRepository.findOne({
                where: { wallet_address },
                relations: { customer: { preferred_currency: true } },
            });

        const { first_name, last_name } = NewCustomerNames.getRandom();

        //create customer input data
        const email = (
            checkCustomerWithWalletAddress && checkCustomerWithWalletAddress.customer ?
                checkCustomerWithWalletAddress.customer.email :
                `${wallet_address}@evm.blockchain`).trim().toLowerCase();

        const customerInputData = {
            email,
            first_name,
            last_name,
            password: 'password', //TODO: (JK) store the default password someplace
            wallet_address,
        };

        handler.logger.debug('customer input is ' + JSON.stringify(customerInputData));
        //verify the signature
        const siweMessage = new SiweMessage(message);
        let siweResponse = await siweMessage.verify({ signature });
        handler.logger.debug('siwe response is ' + JSON.stringify(siweResponse));
        if (!siweResponse.success) {
            throw new Error('Error in validating wallet address signature');
        }

        handler.logger.debug(
            'customer data is ' + checkCustomerWithWalletAddress
        );
        let newCustomerData: Customer;

        if (!checkCustomerWithWalletAddress) {
            handler.logger.debug('creating new customer ');
            const customer = await customerService.create(customerInputData);
            newCustomerData = await CustomerRepository.findOne({
                where: { email: email },
                relations: { preferred_currency: true },
            });
            created = (customer ? true : false);

            if (!created) {
                handler.logger.error(`Failure to create customer record with ${JSON.stringify(customerInputData)}`);
                throw new Error(`Failure to create customer record for ${customerInputData.wallet_address}.`);
            }
        } else {
            //if customer record exists, authenticate the user
            let authResult = await authService.authenticateCustomer(
                email,
                customerInputData.password,
                customerInputData.wallet_address
            );
            handler.logger.debug('auth result is ' + JSON.stringify(authResult));
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
            email: email,
            wallet_address: customerInputData.wallet_address,
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

        handler.returnStatus(200, { status: true, data: body });
    });
};
