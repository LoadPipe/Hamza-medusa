import type {
    MedusaRequest,
    MedusaResponse,
    Logger,
} from '@medusajs/medusa';
import CustomerRepository from '../../../repositories/customer';
import { RouteHandler } from '../../route-handler';


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const logger = req.scope.resolve('logger') as Logger;

    const handler: RouteHandler = new RouteHandler(req, res, 'GET', '/custom/oauth-sim');


    await handler.handle(async () => {
        //get the cookies 
        if (handler.inputParams.success === 'true') {
            //update the user record if all good
            await CustomerRepository.update(
                { id: handler.inputParams.customer_id },
                {
                    email: Math.floor(Math.random() * 1000000).toString() + '@gmail.com',
                    is_verified: true,
                    first_name: 'Pzwell',
                    last_name: 'mR>krth',
                }
            );

            //redirect 
            return res.redirect(`${process.env.STORE_URL}/account?verify=true`);
        }
        else {
            return res.redirect(`${process.env.STORE_URL}/account?verify=false&error=true&reason=insufficient robux`);
        }
    });
};
