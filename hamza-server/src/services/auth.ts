import { AuthService as MedusaAuthService, Logger } from '@medusajs/medusa';
import { Lifetime } from 'awilix';
import { AuthenticateResult } from '@medusajs/medusa/dist/types/auth';

type ExtendedAuthenticateResult = AuthenticateResult & {
    wallet_address?: string; // Optional property
};

export default class AuthService extends MedusaAuthService {
    static LIFE_TIME = Lifetime.SINGLETON;
    protected readonly logger: Logger;

    constructor(container) {
        super(container);
        // Assuming you have additional setup or properties to include
        this.logger = container.logger;
    }

    // Overload to keep the original authenticate method signature
    async authenticate(
        email: string,
        password: string
    ): Promise<AuthenticateResult>;
    // Custom method signature for handling authentication with wallet address
    async authenticate(
        email: string,
        password: string,
        wallet_address?: string
    ): Promise<ExtendedAuthenticateResult>;
    // Unified method implementation
    //TODO: (CLEANUP) is this ever called?
    async authenticate(
        email: string,
        password: string,
        wallet_address?: string
    ): Promise<ExtendedAuthenticateResult | AuthenticateResult> {
        this.logger.info('calling medusa authenticate....');
        const authResult: AuthenticateResult = await super.authenticate(
            email,
            password
        );

        // Handle the wallet address logic separately, depending on your application's needs
        // This could be adding the wallet address to the user's profile, logging it, etc.
        // For demonstration, just adding it to the result if provided
        if (wallet_address) {
            const extendedResult: ExtendedAuthenticateResult = {
                ...authResult,
                wallet_address,
            };
            this.logger.info(
                `Authentication succeeded, wallet address: ${wallet_address}`
            );
            return extendedResult;
        }

        return authResult;
    }

    async authenticateCustomer(
        email: string,
        password: string,
        wallet_address?: string
    ): Promise<ExtendedAuthenticateResult> {
        this.logger.debug('calling medusa authenticate....');
        const authResult: AuthenticateResult = await super.authenticateCustomer(
            email,
            password
        );

        // Handle the wallet address logic separately, depending on your application's needs
        // This could be adding the wallet address to the user's profile, logging it, etc.
        // For demonstration, just adding it to the result if provided
        if (wallet_address) {
            const extendedResult: ExtendedAuthenticateResult = {
                ...authResult,
                wallet_address,
            };
            this.logger.info(
                `Authentication succeeded, wallet address: ${wallet_address}`
            );
            return extendedResult;
        }

        return authResult;
    }
}
