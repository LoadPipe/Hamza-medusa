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

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    let eventBus_: EventBusService = req.scope.resolve('eventBusService');

    const handler: RouteHandler = new RouteHandler(
        req, res, 'GET', '/custom/discord'
    );

    handler.onError = (err: any) => {
        res.redirect(
            `${process.env.STORE_URL}/account?verify=false&error=true`);
    }

    await handler.handle(async () => {
        handler.logger.debug(`discord oauth cookies: ${JSON.stringify(req.cookies)}`);
        let decoded: any = jwt.decode(req.cookies['_medusa_jwt']);
        handler.logger.debug(
            `discord oauth decoded _medusa_jwt: ${JSON.stringify(decoded)}`
        );
        handler.logger.debug(`discord oauth req.params: ${JSON.stringify(req.params)}`);

        const tokenResponse = await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: process.env.DISCORD_ACCESS_KEY,
                client_secret: process.env.DISCORD_ACCESS_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: process.env.DISCORD_REDIRECT_URL,
                code: req.query.code.toString(),
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const userResponse = await axios.get(
            'https://discord.com/api/users/@me',
            {
                headers: {
                    Authorization: `Bearer ${tokenResponse.data.access_token}`,
                },
            }
        );

        handler.logger.debug(`user response: ${userResponse.data}`);

        if (userResponse.data.email) {
            await CustomerRepository.update(
                { id: decoded.customer_id },
                {
                    email: userResponse.data.email,
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
            return res.redirect(`${process.env.STORE_URL}/account?verify=true`);
        }

        handler.logger.debug('Failed to retrieve email from discord');
        return res.send({
            status: false,
            message: 'Failed to retrieve email from discord',
        });
    });

    /*
    try {
        let eventBus_: EventBusService = req.scope.resolve('eventBusService');

        logger.debug(`discord oauth cookies: ${JSON.stringify(req.cookies)}`);
        let decoded: any = jwt.decode(req.cookies['_medusa_jwt']);
        logger.debug(
            `discord oauth decoded _medusa_jwt: ${JSON.stringify(decoded)}`
        );
        logger.debug(`discord oauth req.params: ${JSON.stringify(req.params)}`);

        const tokenResponse = await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: process.env.DISCORD_ACCESS_KEY,
                client_secret: process.env.DISCORD_ACCESS_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: process.env.DISCORD_REDIRECT_URL,
                code: req.query.code.toString(),
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const userResponse = await axios.get(
            'https://discord.com/api/users/@me',
            {
                headers: {
                    Authorization: `Bearer ${tokenResponse.data.access_token}`,
                },
            }
        );

        logger.debug(`user response: ${userResponse.data}`);

        if (userResponse.data.email) {
            await CustomerRepository.update(
                { id: decoded.customer_id },
                {
                    email: userResponse.data.email,
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
            return res.redirect(`${process.env.STORE_URL}/account?verify=true`);
        }

        logger.debug('Failed to retrieve email from discord');
        return res.send({
            status: false,
            message: 'Failed to retrieve email from discord',
        });
    } catch (err) {
        logger.error('Error creating product review:', err);
        return res.redirect(
            `${process.env.STORE_URL}/account?verify=false&error=true`
        );
    }
    */
};
