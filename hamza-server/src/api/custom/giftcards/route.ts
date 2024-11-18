import { Customer, MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import CustomerRepository from '../../../repositories/customer';
import { RouteHandler } from '../../route-handler';
import axios from 'axios';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    //const globeTopperService: GlobeTopperService =
    //    req.scope.resolve('globeTopperService');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/giftcards'
    );

    await handler.handle(async () => {
        //https://partner.sandbox.globetopper.com/api/v2/catalogue/search-catalogue

        const results = await axios.get(
            'https://partner.sandbox.globetopper.com/api/v2/catalogue/search-catalogue',
            {
                headers: {
                    authorization:
                        'Bearer Shadstone:dgmer6i9lyrt1ftaftp3h3v56o5uxqh7',
                },
            }
        );

        //console.log(results);
        console.log(results.data.records[0]);

        return handler.returnStatus(200, { status: 'ok' });
    });
};
