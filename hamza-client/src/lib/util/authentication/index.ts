'use server';

import { medusaClient } from '@/lib/config/config';
import axios from 'axios';

declare class StorePostAuthReqCustom {
    email: string;
    password: string;
    wallet_address: string;
}

const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const VERIFY_MSG_URL = `${MEDUSA_SERVER_URL}/custom/verify`;
const GET_NONCE_URL = `${MEDUSA_SERVER_URL}/custom/nonce`;

export async function getNonce() {
    //const response = await fetch(GET_NONCE_URL);
    //const data = await response.json();
    const output = await axios.get(GET_NONCE_URL, {
        headers: {
            'Content-Type': 'application/json',
            'Cache-control': 'no-cache, no-store',
            Accept: 'application/json',
        },
    });

    return output?.data?.nonce ?? '';
}

export async function sendVerifyRequest(message: any, signature: any) {
    return await axios.post(
        VERIFY_MSG_URL,
        {
            message,
            signature,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Cache-control': 'no-cache, no-store',
                Accept: 'application/json',
            },
        }
    );
}

export async function getToken(credentials: StorePostAuthReqCustom) {
    //set email & password automatically if not provided
    if (!credentials.email || !credentials.email.length)
        credentials.email = `${credentials.wallet_address}@evm.blockchain`;
    if (!credentials.password || !credentials.password.length)
        credentials.password = 'password'; //TODO: (JK) store this default value someplace

    return medusaClient.auth
        .getToken(credentials, {
            next: {
                tags: ['auth'],
            },
        })
        .then(({ access_token }) => {
            //TODO: is the following commented out code needed? (JK)access_token && cookies().set('_medusa_jwt', access_token);
            return access_token;
        })
        .catch((err) => {
            throw new Error('Wrong email or password.');
        });
}
