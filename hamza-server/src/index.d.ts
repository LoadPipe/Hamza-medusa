// We're extending CORE Medusa models here

import { Currency, Store } from '@medusajs/medusa';
import { Role } from './models/role';
import { User } from './models/user';
import { ProductReview } from './models/product-review';

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
        preferred_currency_id?: string;
        preferred_currency?: Currency;
    }
}

export declare module '@medusajs/medusa/dist/models/line-item' {
    declare interface LineItem {
        currency_code: string;
    }
}

export declare module '@medusajs/medusa/dist/models/store' {
    declare interface Store {
        owner?: User;
        owner_id?: string;
        roles: Role[];
        numberOfFollowers: number;
        icon: string;
    }
}

export declare module '@medusajs/medusa/dist/models/product' {
    declare interface Product {
        store?: Store;
        store_id: string;
        reviews: ProductReview[];
        bucky_metadata?: string;
    }
}

export declare module '@medusajs/medusa/dist/models/product-variant' {
    declare interface ProductVariant {
        bucky_metadata?: string;
    }
}

export declare module '@medusajs/medusa/dist/model/order' {
    declare interface Order {
        store?: Store;
        store_id: string;
        massmarket_order_id?: string;
        massmarket_ttl?: number;
        massmarket_amount?: string;
        bucky_order_no?: string;
        bucky_partner_order_no?: string;
    }
}
