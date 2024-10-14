import type {
    EventBusService,
    MedusaRequest,
    MedusaResponse,
} from '@medusajs/medusa';
import axios from 'axios';
import CustomerRepository from '../../../repositories/customer';
import { RouteHandler } from '../../route-handler';
import { redirectToOauthLandingPage } from '../../../utils/oauth';
import { Not } from 'typeorm';

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerRepository: typeof CustomerRepository =
        req.scope.resolve('customerRepository');
    const eventBusService: EventBusService =
        req.scope.resolve('eventBusService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'PUT',
        '/custom/oauth',
        ['type', 'code']
    );

    // handler.onError = (err: any) => {
    //     redirectToOauthLandingPage(
    //         res,
    //         'google',
    //         false,
    //         'An unknown error has occurred'
    //     );
    // };

    await handler.handle(async () => {
        //validate
        if (!handler.requireParams(['code', 'type'])) return;

        //enforce security
        if (!handler.customerId?.length)
            return handler.returnStatusWithMessage(401, 'JWT not provided');

        if (handler.inputParams.type === 'google')
            return await handleGoogle(
                handler,
                customerRepository,
                eventBusService
            );

        if (handler.inputParams.type === 'discord')
            return await handleDiscord(
                handler,
                customerRepository,
                eventBusService
            );

        return handler.returnStatus(200, {
            success: false,
            message: 'Unrecognized OAuth type',
        });
    });
};

async function handleGoogle(
    handler: RouteHandler,
    customerRepository: typeof CustomerRepository,
    eventBusService: EventBusService
) {
    console.log('*****handle google******');
    //get google oauth data
    let tokens = await getGoogleOAuthTokens({
        code: handler.inputParams.code,
    });

    console.log('*****Getting Tokens******');

    if (!tokens) {
        console.log('*****nO Tokens******');
        return handler.returnStatus(200, {
            success: false,
            message: 'Did not recieve oauth token',
        });
    }

    console.log('*****Got Tokens******');
    handler.logger.debug(`Google OAuth tokens: ${JSON.stringify(tokens)}`);
    //get google user data
    let user = await getGoogleUser({
        id_token: tokens.id_token,
        access_token: tokens.access_token,
    });

    if (!user)
        return handler.returnStatus(200, {
            success: false,
            message: 'Did not recieve oauth user',
        });

    handler.logger.debug(`Google OAuth user: ${JSON.stringify(user)}`);

    const customerId = handler.customerId;
    const email = user.email?.trim()?.toLowerCase();

    //check that email isn't already taken
    const existingCustomer = await customerRepository.findOne({
        where: { id: Not(handler.customerId), email: email },
    });

    console.log('*****Get User******');

    if (existingCustomer) {
        return handler.returnStatus(200, {
            success: false,
            message: `The email address ${email} is already taken by another account.`,
        });
    }

    //update the user record if all good
    await customerRepository.update(
        { id: customerId },
        {
            email: email,
            is_verified: true,
            first_name: user.given_name,
            last_name: user.family_name,
        }
    );

    //emit an event
    await eventBusService.emit([
        {
            data: { email: user.email, id: handler.customerId },
            eventName: 'customer.verified',
        },
    ]);

    //redirect
    return handler.returnStatus(200, { success: true });
}

async function handleDiscord(
    handler: RouteHandler,
    customerRepository: typeof CustomerRepository,
    eventBusService: EventBusService
) {
    const tokenResponse = await axios.post(
        'https://discord.com/api/oauth2/token',
        new URLSearchParams({
            client_id: process.env.DISCORD_ACCESS_KEY,
            client_secret: process.env.DISCORD_ACCESS_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: process.env.DISCORD_REDIRECT_URL,
            code: handler.inputParams.code,
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    if (!tokenResponse)
        return handler.returnStatus(200, {
            success: false,
            message: 'Did not recieve oauth token',
        });

    const userResponse = await axios.get('https://discord.com/api/users/@me', {
        headers: {
            Authorization: `Bearer ${tokenResponse.data.access_token}`,
        },
    });

    if (!userResponse)
        return handler.returnStatus(200, {
            success: false,
            message: 'Did not recieve oauth user',
        });
    handler.logger.debug(`user response: ${userResponse.data}`);

    if (!userResponse.data.email) {
        return handler.returnStatus(200, {
            success: false,
            message: 'Did not recieve oauth user email',
        });
    }

    const email = userResponse.data?.email?.trim()?.toLowerCase();

    //check that email isn't already taken
    const existingCustomer = await customerRepository.findOne({
        where: { id: Not(handler.customerId), email: email },
    });
    if (existingCustomer) {
        return handler.returnStatus(200, {
            success: false,
            message: `The email address ${email} is already taken by another account.`,
        });
    }

    //update the user record if all good
    await customerRepository.update(
        { id: handler.customerId },
        {
            email: email,
            is_verified: true,
            first_name: userResponse.data.global_name.split(' ')[0],
            last_name: userResponse.data.global_name.split(' ')[1] || '',
        }
    );

    await eventBusService.emit([
        {
            data: {
                email: userResponse.data.email,
                id: handler.customerId,
            },
            eventName: 'customer.verified',
        },
    ]);

    return handler.returnStatus(200, { success: true });
}

interface GoogleTokensResult {
    access_token: string;
    expires_in: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
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

async function getGoogleOAuthTokens({
    code,
}: {
    code: string;
}): Promise<GoogleTokensResult> {
    console.log('****RUNNING GOAUTH****');
    const url = 'https://oauth2.googleapis.com/token';

    const values = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URL,
        grant_type: 'authorization_code',
    };
    console.log('*****VALUES*****', values);

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
        console.log('response data', res.data);
        return res.data;
    } catch (error: any) {
        console.log('****Error here ****', error);
        throw new Error(error.message);
    }
}

async function getGoogleUser({
    id_token,
    access_token,
}: {
    id_token: string;
    access_token: string;
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
        throw new Error(error.message);
    }
}
