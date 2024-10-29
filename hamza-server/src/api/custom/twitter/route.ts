import axios from 'axios';
import { Request, Response } from 'express';
import { RouteHandler } from '../../route-handler';
import CustomerRepository from '../../../repositories/customer';
import { ILogger } from '../../../utils/logging/logger';
import jwt from 'jsonwebtoken';
import { redirectToOauthLandingPage } from '../../../utils/oauth';
import { Not } from 'typeorm';

// add your client id and secret here:
const TWITTER_OAUTH_CLIENT_ID = process.env.TWITTER_ACCESS_KEY!;
const TWITTER_OAUTH_CLIENT_SECRET = process.env.TWITTER_ACCESS_SECRET!;

// the url where we get the twitter access token from
const TWITTER_OAUTH_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';

// we need to encrypt our twitter client id and secret here in base 64 (stated in twitter documentation)
const BasicAuthToken = Buffer.from(
    `${TWITTER_OAUTH_CLIENT_ID}:${TWITTER_OAUTH_CLIENT_SECRET}`,
    'utf8'
).toString('base64');

// filling up the query parameters needed to request for getting the token
export const twitterOauthTokenParams = {
    client_id: TWITTER_OAUTH_CLIENT_ID,
    code_verifier: '8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA',
    redirect_uri: `${process.env.TWITTER_OAUTH_REDIRECT_URL}`,
    grant_type: 'authorization_code',
};

// the shape of the object we should recieve from twitter in the request
type TwitterTokenResponse = {
    token_type: 'bearer';
    expires_in: 7200;
    access_token: string;
    scope: string;
};


// the main step 1 function, getting the access token from twitter using the code that the twitter sent us
export async function getTwitterOAuthToken(
    code: string,
    logger?: ILogger
) {
    try {
        // POST request to the token url to get the access token
        const res = await axios.post<TwitterTokenResponse>(
            TWITTER_OAUTH_TOKEN_URL,
            new URLSearchParams({
                ...twitterOauthTokenParams,
                code,
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${BasicAuthToken}`,
                },
            }
        );

        return res.data;
    } catch (err) {
        logger?.error('Error getting twitter oauth token', err);
        return null;
    }
}

// the shape of the response we should get
export interface TwitterUser {
    id: string;
    name: string;
    username: string;
}

// getting the twitter user from access token
export async function getTwitterUser(
    accessToken: string,
    logger?: ILogger
): Promise<TwitterUser | null> {
    try {
        // request GET https://api.twitter.com/2/users/me
        const res = await axios.get<{ data: TwitterUser }>(
            'https://api.twitter.com/2/users/me?user.fields=username,name,id,email',
            {
                headers: {
                    'Content-type': 'application/json',
                    // put the access token in the Authorization Bearer token
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return res.data.data ?? null;
    } catch (err) {
        logger?.error('Error getting twitter oauth token', err);
        return null;
    }
}

// the function which will be called when twitter redirects to the server at https://www.localhost:3001/oauth/twitter
export async function GET(
    req: Request<any, any, any, { code: string }>,
    res: Response
) {
    const customerRepository: typeof CustomerRepository = req.scope.resolve('customerRepository');
    const handler: RouteHandler = new RouteHandler(req, res, 'GET', '/custom/twitter');

    handler.onError = (err: any) => {
        redirectToOauthLandingPage(res, 'twitter', false, 'An unknown error has occurred');
    };

    await handler.handle(async () => {
        const code = req.query.code;

        handler.logger.debug(`twitter oauth cookies: ${JSON.stringify(req.cookies)}`);
        let decoded: any = jwt.decode(req.cookies['_medusa_jwt']);
        handler.logger.debug(
            `twitter oauth decoded _medusa_jwt: ${JSON.stringify(decoded)}`
        );
        handler.logger.debug(`twitter oauth req.params: ${JSON.stringify(req.params)}`);

        //throw error if anything wrong with the cookie
        if (!decoded)
            return redirectToOauthLandingPage(res, 'twitter', false, 'Unable to get the JWT cookie');

        // 1. get the access token with the code
        const twitterOAuthToken = await getTwitterOAuthToken(code, handler.logger);
        if (!twitterOAuthToken) {
            // redirect if no auth token
            return redirectToOauthLandingPage(res, 'twitter', false, 'Unable to get the X OAUTH token');
        }

        // 2. get the twitter user using the access token
        const twitterUser = await getTwitterUser(
            twitterOAuthToken.access_token,
            handler.logger
        );

        handler.logger.debug(`Twitter user: ${JSON.stringify(twitterUser)}`);

        // redirect if no twitter user
        if (!twitterUser)
            return redirectToOauthLandingPage(res, 'twitter', false, 'Unable to get the X OAUTH user');

        //split firstname/lastname 
        let first_name = '';
        let last_name = '';
        if (twitterUser?.name) {
            const fullName = twitterUser.name.split(' ');
            first_name = fullName[0];
            if (fullName.length > 1) {
                last_name = fullName.slice(1).join(' ');
            }
        }

        //redirect if no email address available
        return redirectToOauthLandingPage(res, 'twitter', false, 'Unable to retrieve email address');

        const customerId = decoded.customer_id;
        const email = ''; //no way to get twitter email

        //check that email isn't already taken
        const existingCustomer = await customerRepository.findOne({
            where: { id: Not(decoded.customer_id), email: email }
        });
        if (existingCustomer) {
            return redirectToOauthLandingPage(res, 'google', false, `The email address ${email} is already taken by another account.`);
        }

        //update the user record if all good
        await customerRepository.update(
            { id: customerId },
            {
                email: email,
                is_verified: true,
                first_name,
                last_name,
            }
        );

        // 5. finally redirect to the client
        return redirectToOauthLandingPage(res, 'twitter');
    });
}
