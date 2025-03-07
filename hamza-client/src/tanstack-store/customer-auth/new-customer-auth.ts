import { Store } from '@tanstack/store';
import { AuthenticationStatus } from '@rainbow-me/rainbowkit';

// Define the shape of our state
export type CustomerAuthState = {
    walletAddress: string;
    hnsAvatar: string | null;
    hnsName: string | null;
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
    isHydrated: boolean;
};
// Default state
const defaultState: CustomerAuthState = {
    walletAddress: '',
    hnsAvatar: null,
    hnsName: null,
    authData: {
        wallet_address: '',
        token: '',
        customer_id: '',
        status: 'unauthenticated' as AuthenticationStatus,
        is_verified: false,
    },
    whitelist_config: {
        is_whitelisted: false,
        whitelisted_stores: [],
    },
    preferred_currency_code: null,
    isHydrated: false,
};


// Key for localStorage persistence
const LOCAL_STORAGE_KEY = '__new_hamza_customer';

const saveCustomerAuthToStorage = (state: Record<string, any>) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
};


function deepMerge<T>(target: T, source: Partial<T>): T {
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const sourceVal = source[key];
            const targetVal = target[key];
            if (sourceVal && typeof sourceVal === 'object' && !Array.isArray(sourceVal)) {
                target[key] = deepMerge(
                    targetVal && typeof targetVal === 'object' ? targetVal : {},
                    sourceVal
                ) as any;
            } else {
                target[key] = sourceVal as any;
            }
        }
    }
    return target;
}

const loadCustomerAuthFromStorage = (): CustomerAuthState => {
    if (typeof window === 'undefined') {
        return { ...defaultState };
    }
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            // Deep merge using the custom function
            return deepMerge({ ...defaultState }, parsed);
        } catch (error) {
            console.error('Error parsing stored customer auth data:', error);
            return { ...defaultState };
        }
    }
    return { ...defaultState };
};


// Create the store with the loaded state
export const customerAuthStore = new Store<CustomerAuthState>({
    ...loadCustomerAuthFromStorage(),
});


// Subscribe to store changes and persist updates to localStorage
customerAuthStore.subscribe(({ currentVal }) => {
    saveCustomerAuthToStorage(currentVal);
});


// Action to update walletAddress
export const setWalletAddress = (walletAddress: string) => {
    customerAuthStore.setState((state) => ({ ...state, walletAddress }));
};

// Action to update hnsAvatar
export const setHnsAvatar = (hnsAvatar: string | null) => {
    customerAuthStore.setState((state) => ({ ...state, hnsAvatar }));
};

// Action to update hnsName
export const setHnsName = (hnsName: string | null) => {
    customerAuthStore.setState((state) => ({ ...state, hnsName }));
};

// Action to update authData
export const setCustomerAuthData = (authData: CustomerAuthState['authData']) => {
    customerAuthStore.setState((state) => ({ ...state, authData }));
};

// Action to update the preferred currency
export const setCustomerPreferredCurrency = (currency: string) => {
    customerAuthStore.setState((state) => ({ ...state, preferred_currency_code: currency }));
};

// Action to update the whitelist configuration
export const setWhitelistConfig = (configData: CustomerAuthState['whitelist_config']) => {
    customerAuthStore.setState((state) => ({ ...state, whitelist_config: configData }));
};

// Action to update the is_verified flag inside authData
export const setIsVerified = (isVerified: boolean) => {
    customerAuthStore.setState((state) => ({
        ...state,
        authData: {
            ...state.authData,
            is_verified: isVerified,
        },
    }));
};

// Action to mark the store as hydrated
export const setHydrated = (value: boolean) => {
    customerAuthStore.setState((state) => ({ ...state, isHydrated: value }));
};
