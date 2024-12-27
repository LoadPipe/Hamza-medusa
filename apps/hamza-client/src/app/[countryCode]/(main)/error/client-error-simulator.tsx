'use client';

import { useEffect } from 'react';

export default function ClientErrorSimulator() {
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            throw new Error('Client-side error has occurred');
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, []);

    return <h2>Client component loaded. Error will occur shortly...</h2>;
}
