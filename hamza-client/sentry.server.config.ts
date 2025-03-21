// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

if (process.env.NEXT_ENABLE_SENTRY === 'true') {
    Sentry.init({
        dsn: 'https://6135c256ebc8bea0eb0e6a5c539d8ed4@o4508058323648512.ingest.de.sentry.io/4508058325286992',

        // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
        tracesSampleRate: 1,

        // Setting this option to true will print useful information to the console while you're setting up Sentry.
        debug: false,
    });
}
