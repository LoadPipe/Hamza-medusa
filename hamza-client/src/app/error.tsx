'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type ErrorPageProps = {
    error: any,
    reset: any
};

export default function Error({ error, reset }: ErrorPageProps) {
    const router = useRouter();

    useEffect(() => {
        console.error(error);
    }, [error]);

    const handleBack = () => {
        router.back();
    };

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Something went wrong!</h1>
            <p>{error?.message || 'An unexpected error has occurred.'}</p>
            <button onClick={handleBack} style={{ marginTop: '20px' }}>
                Go Back
            </button>
            <button onClick={reset} style={{ marginTop: '20px' }}>
                Try Again
            </button>
        </div>
    );
}