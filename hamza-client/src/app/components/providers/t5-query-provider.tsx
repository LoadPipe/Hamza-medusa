'use client';

import {
    QueryClientProvider,
    QueryClient,
    isServer,
} from '@tanstack/react-query';

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // ⏳ 1 min - Prevents unnecessary refetches, keeping data fresh
                refetchOnWindowFocus: false, // Avoids re-fetching when switching tabs
                refetchOnReconnect: true, // ✅ Ensures fresh data after reconnection
                refetchOnMount: false, // Prevents redundant fetches when remounting components
                retry: 0, // 🔄 Retries failed queries twice before throwing an error
                gcTime: 3 * 60 * 1000, // ⏳ Default gc time is now 3 mins
            },
            mutations: {
                retry: 2, // 🔄 Retries mutations twice before failing (handles network issues)
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (isServer) {
        // Server: always make a new query client
        return makeQueryClient();
    } else {
        // Browser: make a new query client if we don't already have one
        // This is very important, so we don't re-make a new client if React
        // suspends during the initial render. This may not be needed if we
        // have a suspense boundary BELOW the creation of the query client
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}

export default function T5QueryProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
