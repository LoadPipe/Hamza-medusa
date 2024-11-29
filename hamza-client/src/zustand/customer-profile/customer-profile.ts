import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type State = {
    first_name: string | null;
    last_name: string | null;
    address: string | null;
    company: string | null;
    postal_code: string | null;
    province: string | null;
    email: string | null;
    phone: string | null;
    perferredCurrency: string | null;
};

type Actions = {
    setFirstName: (first_name: string) => void;
    setLastName: (last_name: string) => void;
    setAddress: (address: string) => void;
    setCompany: (company: string) => void;
    setPostalCode: (postal_code: string) => void;
    setProvince: (province: string) => void;
    setEmail: (email: string) => void;
    setPhone: (phone: string) => void;
    setCurrencyCode: (perferredCurrency: string) => void;
};

export const useCustomerProfileStore = create<State & Actions>()(
    persist(
        (set, get) => ({
            first_name: null,
            last_name: null,
            address: null,
            company: null,
            postal_code: null,
            province: null,
            email: null,
            phone: null,
            perferredCurrency: null,
            setFirstName: (first_name: string) => set({ first_name }),
            setLastName: (last_name: string) => set({ last_name }),
            setAddress: (address: string) => set({ address }),
            setCompany: (company: string) => set({ company }),
            setPostalCode: (postal_code: string) => set({ postal_code }),
            setProvince: (province: string) => set({ province }),
            setEmail: (email: string) => set({ email }),
            setPhone: (phone: string) => set({ phone }),
            setCurrencyCode: (perferredCurrency: string) =>
                set({ perferredCurrency }),
        }),
        {
            name: '__hamza_profile',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
