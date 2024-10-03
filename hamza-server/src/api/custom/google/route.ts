import type {
    EventBusService,
    MedusaRequest,
    MedusaResponse,
    Logger,
} from '@medusajs/medusa';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import CustomerRepository from '../../../repositories/customer';
import { RouteHandler } from '../../route-handler';
import { redirectToOauthLandingPage } from 'src/utils/oauth';

interface GoogleTokensResult {
    access_token: string;
    expires_in: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
}

async function getGoogleOAuthTokens({
    code,
    logger,
}: {
    code: string;
    logger: Logger;
}): Promise<GoogleTokensResult> {
    const url = 'https://oauth2.googleapis.com/token';

    const values = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URL,
        grant_type: 'authorization_code',
    };

    logger.debug(`values: ${JSON.stringify(values)}`);
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
        logger.error(`error in getting google token: ${error}`);
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
    logger,
}: {
    id_token: string;
    access_token: string;
    logger: Logger;
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
        logger.error(`Error in getting google user: ${error}`);
        throw new Error(error.message);
    }
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/google'
    );

    handler.onError = (err: any) => {
        redirectToOauthLandingPage(res, 'google', false, 'An unknown error has occurred');
    };

    await handler.handle(async () => {
        //get the cookies

        logger.debug(`google oauth cookies: ${JSON.stringify(req.cookies)}`);
        let decoded: any = jwt.decode(req.cookies['_medusa_jwt']);
        logger.debug(
            `google oauth decoded _medusa_jwt: ${JSON.stringify(decoded)}`
        );
        logger.debug(`google oauth req.params: ${JSON.stringify(req.params)}`);

        //throw error if anything wrong with the cookie
        if (!decoded)
            return redirectToOauthLandingPage(res, 'google', false, 'Unable to get the JWT cookie');

        //get google oauth data
        let tokens = await getGoogleOAuthTokens({
            code: req.query.code.toString(),
            logger,
        });

        if (!tokens)
            return redirectToOauthLandingPage(res, 'google', false, 'Unable to get the Google OAuth token');
        logger.debug(`Google OAuth tokens: ${JSON.stringify(tokens)}`);

        //get google user data
        let user = await getGoogleUser({
            id_token: tokens.id_token,
            access_token: tokens.access_token,
            logger,
        });

        if (!user)
            return redirectToOauthLandingPage(res, 'google', false, 'Unable to get the Google OAuth user');
        logger.debug(`Google OAuth user: ${JSON.stringify(user)}`);

        //update the user record if all good
        await CustomerRepository.update(
            { id: decoded.customer_id },
            {
                email: user.email?.trim()?.toLowerCase(),
                is_verified: true,
                first_name: user.given_name,
                last_name: user.family_name,
            }
        );

        //emit an event
        let eventBus_: EventBusService = req.scope.resolve('eventBusService');
        await eventBus_.emit([
            {
                data: { email: user.email, id: decoded.customer_id },
                eventName: 'customer.verified',
            },
        ]);

        //redirect
        return redirectToOauthLandingPage(res, 'google');
    });
};
