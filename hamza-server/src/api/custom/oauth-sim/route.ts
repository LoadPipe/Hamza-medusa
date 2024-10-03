import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import CustomerRepository from '../../../repositories/customer';
import { RouteHandler } from '../../route-handler';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/oauth-sim'
    );

    await handler.handle(async () => {
        //get the cookies
        if (handler.inputParams.success === 'true') {
            //update the user record if all good
            await CustomerRepository.update(
                { id: handler.inputParams.customer_id },
                {
                    email:
                        Math.floor(Math.random() * 1000000).toString() +
                        '@gmail.com',
                    is_verified: true,
                    first_name: 'Pzwell',
                    last_name: 'mR>krth',
                }
            );

            //redirect
            return res.redirect(`${process.env.STORE_URL}/account?verify=true`);
        } else {
            const errorReason =
                'We couldn’t verify your Google account. Please check the verification link and try again, or request a new link below.';
            const redirectUrl = `${process.env.STORE_URL}account/verify?verify=false&error=true&reason=${encodeURIComponent(errorReason)}`;

            logger.info(`Redirecting to URL: ${redirectUrl}`);

            // Redirect with the error reason
            return res.redirect(redirectUrl);
        }
    });
};
