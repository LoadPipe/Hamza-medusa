import type {
    EventBusService,
    MedusaRequest,
    MedusaResponse,
} from '@medusajs/medusa';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import CustomerRepository from '../../../repositories/customer';

interface GoogleTokensResult {
    access_token: string;
    expires_in: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
}

async function getGoogleOAuthTokens({
    code,
}: {
    code: string;
}): Promise<GoogleTokensResult> {
    const url = 'https://oauth2.googleapis.com/token';

    const values = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URL,
        grant_type: 'authorization_code',
    };

    console.log('values', values);
    try {
        const res = await axios.post<GoogleTokensResult>(
            url,
            new URLSearchParams(values),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return res.data;
    } catch (error: any) {
        console.log('error in getting google token', error);

        throw new Error(error.message);
    }
}

interface GoogleUserResult {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    locale: string;
}

async function getGoogleUser({
    id_token,
    access_token,
}): Promise<GoogleUserResult> {
    try {
        const res = await axios.get<GoogleUserResult>(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            }
        );
        return res.data;
    } catch (error: any) {
        console.log('error in getting google user', error);
        throw new Error(error.message);
    }
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        let decoded: any = jwt.decode(req.cookies['_medusa_jwt']);
        let tokens = await getGoogleOAuthTokens({
            code: req.query.code.toString(),
        });

        let user = await getGoogleUser({
            id_token: tokens.id_token,
            access_token: tokens.access_token,
        });

        let eventBus_: EventBusService = req.scope.resolve('eventBusService');

        await CustomerRepository.update(
            { id: decoded.customer_id },
            {
                email: user.email,
                is_verified: true,
                first_name: user.given_name,
                last_name: user.family_name,
            }
        );

        await eventBus_.emit([
            {
                data: { email: user.email },
                eventName: 'customer.verified',
            },
        ]);

        return res.redirect(`${process.env.STORE_URL}/account?verify=true`);
    } catch (err) {
        console.error('Error authorizing google:', err);
        res.status(500).json({
            error: 'Failed to authorize with google',
        });
    }
};
