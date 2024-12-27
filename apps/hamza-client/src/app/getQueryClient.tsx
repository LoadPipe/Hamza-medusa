// Creating a request-scoped singleton instance of QueryClient.
// This ensures that data is not shared between different
// users and requests, while still only creating the QueryClient once per request.

import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react'; // https://react.dev/reference/react/cache

const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;
