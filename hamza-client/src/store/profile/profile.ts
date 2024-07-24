import { create } from 'zustand';

// Define the state and associated actions in an interface
interface ProfileState {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    setFirstName: (firstName: string) => void;
    setLastName: (lastName: string) => void;
    setEmail: (email: string) => void;
    setPhoneNumber: (phoneNumber: string) => void;
}

// Create the Zustand store
const useProfile = create<ProfileState>((set) => ({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    setFirstName: (firstName: string) => set({ firstName }),
    setLastName: (lastName: string) => set({ lastName }),
    setEmail: (email: string) => set({ email }),
    setPhoneNumber: (phoneNumber: string) => set({ phoneNumber }),
    clearProfile: () =>
        set({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
        }),
}));

export default useProfile;
