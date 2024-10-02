'use client'; // Client Component

import { useEffect } from 'react';

export default function ClientErrorSimulator() {
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Simulate throwing a client-side error after a delay
            throw new Error('Client-side error has occurred');
        }, 2000); // 2 second delay

        return () => clearTimeout(timeoutId); // Cleanup timeout on unmount
    }, []);

    return <h2>Client component loaded. Error will occur shortly...</h2>;
}
