// Creating a request-scoped singleton instance of QueryClient.
// This ensures that data is not shared between different
// users and requests, while still only creating the QueryClient once per request.


// What: If we're using SSR Hydration, we need this component
// Use Case: Only use in SSR co,ponents, DO NOT USE IN CLIENT COMPONENTS
//
/*
    Author: Garo Nazarian
    @Documentation https://github.com/TanStack/query/blob/main/docs/framework/react/guides/advanced-ssr.md
    @What SSR/Request-Scoped Version (using React’s cache):
    This version—like the one you showed—is meant only for server components.
    It ensures a new QueryClient is created per request (avoiding data leakage between users)
    by using React’s cache().
    This version should be exported and used only in your server code (or SSR hydration logic).
 */

import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react'; // https://react.dev/reference/react/cache

const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;
