import { useState, useEffect } from 'react';
import { useCustomerAuthStore } from '@/zustand/customer-auth/customer-auth';

/**
 * Custom hook to delay checking auth state, preventing flashes on refresh
 */
export const useDelayedAuthCheck = (delay = 500) => {
    const { authData } = useCustomerAuthStore();
    const [showAuthCheck, setShowAuthCheck] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowAuthCheck(true), delay);
        return () => clearTimeout(timer); // Cleanup on unmount
    }, [delay]);

    const isAuthenticated = !!authData?.customer_id;
    return { isAuthenticated, showAuthCheck };
};
