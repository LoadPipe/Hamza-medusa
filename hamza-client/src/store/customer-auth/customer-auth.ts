import { AuthenticationStatus } from '@rainbow-me/rainbowkit';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type State = {
    authData: {
        wallet_address: string;
        token: string;
        customer_id: string;
        status: AuthenticationStatus;
        is_verified: boolean;
    };
    whitelist_config: {
        is_whitelisted: boolean;
        whitelisted_stores: string[];
    };
    preferred_currency_code: string | null;
};

type Actions = {
    setCustomerAuthData: (authData: State['authData']) => void;
    setCustomerPreferredCurrency: (currency: string) => void;
    setWhitelistConfig: (configData: State['whitelist_config']) => void;
};

export const useCustomerAuthStore = create<State & Actions>()(
    persist(
        (set, get) => ({
            authData: {
                customer_id: '',
                is_verified: false,
                status: 'unauthenticated',
                token: '',
                wallet_address: '',
            },
            preferred_currency_code: null,
            whitelist_config: {
                is_whitelisted: false,
                whitelisted_stores: [],
            },
            setCustomerAuthData: (authData) => {
                set({
                    authData: authData,
                });
            },
            setCustomerPreferredCurrency: (currency) => {
                set({ preferred_currency_code: currency });
            },

            setWhitelistConfig: (configData) => {
                set({
                    whitelist_config: configData,
                });
            },
        }),

        {
            name: '__hamza_customer', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
);
