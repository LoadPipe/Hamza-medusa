import { RouteHandler } from '../../../route-handler';
import CountryService from '../../../../services/country';
import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'POST',
        '/custom/country/addCountry'
    );

    await handler.handle(async () => {
        const countryService = req.scope.resolve(
            'countryService'
        ) as CountryService;
        const country = await countryService.addCountry();
        handler.returnStatus(200, { country });
    });
};
