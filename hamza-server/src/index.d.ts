// We're extending CORE Medusa models here

import { Currency, Store } from '@medusajs/medusa';
import { Role } from './models/role';
import { User } from './models/user';

// modifying the User model such that email is now optional
export declare module '@medusajs/medusa/dist/models/user' {
    declare interface User {
        wallet_address: string;
        email?: string;
        password_hash?: string;
        store?: Store;
        role_id: string | null;
        team_role: Role | null;
        // walletAddresses: WalletAddress[];
    }
}

export declare module '@medusajs/medusa/dist/models/customer' {
    declare interface Customer {
        wallet_address: string;
        email?: string;
        password_hash?: string;
        preferred_currency?: Currency
    }
}

export declare module '@medusajs/medusa/dist/models/store' {
    declare interface Store {
        owner?: User;
        owner_id?: string;
        roles: Role[];
    }
}

export declare module '@medusajs/medusa/dist/models/product' {
    declare interface Product {
        store?: Store;
        store_id: string;
    }
}
