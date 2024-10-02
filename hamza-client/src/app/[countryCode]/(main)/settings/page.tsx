import { Suspense } from 'react';

// Simulate a server-side timeout before throwing an error
async function simulateServerError(delay: number) {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Server-side network error has occurred'));
        }, delay);
    });
}

// Server Component
export default async function SettingsPage() {
    // Wait for the error after a delay
    await simulateServerError(2000); // 2 second delay

    // This part won't be reached, as the error will be thrown above
    return <h1>Settings page loaded successfully</h1>;
}
