'use client';

import { MedusaProvider as MedusaReactProvider } from 'medusa-react';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();
const API_KEY = process.env.NEXT_PUBLIC_PUBLISHABLE_API_KEY;
const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

// Wraps the Medusa like a burrito
export default function MedusaProvider({
    children,
    token,
}: {
    children: React.ReactNode;
    token?: string;
}) {
    return (
        <MedusaReactProvider
            queryClientProviderProps={{ client: queryClient }}
            baseUrl={MEDUSA_SERVER_URL}
            publishableApiKey={API_KEY}
            customHeaders={{
                authorization: token ? `Bearer ${token}` : undefined,
            }}
        >
            {children}
        </MedusaReactProvider>
    );
}
