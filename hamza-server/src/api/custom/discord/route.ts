import {
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

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    let eventBus_: EventBusService = req.scope.resolve('eventBusService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'GET', '/custom/discord'
    );

    handler.onError = (err: any) => {
        redirectToOauthLandingPage(res, 'discord', false, 'An unknown error has occurred');
    }

    await handler.handle(async () => {
        handler.logger.debug(`discord oauth cookies: ${JSON.stringify(req.cookies)}`);
        let decoded: any = jwt.decode(req.cookies['_medusa_jwt']);
        handler.logger.debug(
            `discord oauth decoded _medusa_jwt: ${JSON.stringify(decoded)}`
        );
        handler.logger.debug(`discord oauth req.params: ${JSON.stringify(req.params)}`);

        if (!decoded)
            return redirectToOauthLandingPage(res, 'discord', false, 'Unable to get the medusa_jwt token');

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
            return redirectToOauthLandingPage(res, 'discord', false, 'Unable to get discord OAuth token');

        const userResponse = await axios.get(
            'https://discord.com/api/users/@me',
            {
                headers: {
                    Authorization: `Bearer ${tokenResponse.data.access_token}`,
                },
            }
        );

        if (!userResponse)
            return redirectToOauthLandingPage(res, 'discord', false, 'Unable to get the Discord user');
        handler.logger.debug(`user response: ${userResponse.data}`);

        if (userResponse.data.email) {
            await CustomerRepository.update(
                { id: decoded.customer_id },
                {
                    email: userResponse.data?.email?.trim()?.toLowerCase(),
                    is_verified: true,
                    first_name: userResponse.data.global_name.split(' ')[0],
                    last_name:
                        userResponse.data.global_name.split(' ')[1] || '',
                }
            );
            await eventBus_.emit([
                {
                    data: {
                        email: userResponse.data.email,
                        id: decoded.customer_id,
                    },
                    eventName: 'customer.verified',
                },
            ]);

            return redirectToOauthLandingPage(res, 'discord');
        }

        handler.logger.debug('Failed to retrieve email from discord');
        return res.send({
            status: false,
            message: 'Failed to retrieve email from discord',
        });
    });
};
