'use client';

import JSCookie from 'js-cookie';

export function getClientCookie(name: string) {
    if (typeof window === 'undefined') {
        // Read a cookie server-side
        return require('next/headers').cookies().get(name)?.value;
    }

    // Read a cookie client-side
    return JSCookie.get(name);
}