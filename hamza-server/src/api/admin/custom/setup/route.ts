import {
    MedusaRequest,
    MedusaResponse,
    Logger,
    Country,
    ShippingOptionPriceType,
} from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import ShippingOptionRepository from '@medusajs/medusa/dist/repositories/shipping-option';
import CountryRepository from '@medusajs/medusa/dist/repositories/country';
import RegionRepository from '@medusajs/medusa/dist/repositories/region';
import FulfillmentProviderRepository from '@medusajs/medusa/dist/repositories/fulfillment-provider';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const shippingOptionRepository: typeof ShippingOptionRepository =
        req.scope.resolve('shippingOptionRepository');
    const countryRepository: typeof CountryRepository =
        req.scope.resolve('countryRepository');
    const regionRepository: typeof RegionRepository =
        req.scope.resolve('regionRepository');
    const fulfillmentRepository: typeof FulfillmentProviderRepository =
        req.scope.resolve('fulfillmentProviderRepository');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/admin/custom/setup'
    );

    await handler.handle(async () => {
        //get default region
        console.log('getting region');
        const region = await regionRepository.findOne({
            where: { name: 'NA' },
        });

        //add new country code
        try {
            const existingCountry = await countryRepository.findOne({
                where: { iso_2: 'en' },
            });

            if (!existingCountry) {
                const newCountry: Country = countryRepository.create({
                    id: 1066,
                    num_code: 1066,
                    iso_2: 'en',
                    iso_3: 'eng',
                    name: 'EN',
                    display_name: 'Numenor',
                    region_id: region.id,
                });

                await countryRepository.save(newCountry);
            }
        } catch (e) {
            handler.logger.error('Error adding country for EN', e);
        }

        //modify existing shipping option
        try {
            const shippingOption = await shippingOptionRepository.findOne({
                where: { name: 'Provider Calculated' },
            });
            shippingOption.price_type = ShippingOptionPriceType.CALCULATED;
            shippingOption.provider_id = 'store-fulfillment';

            await shippingOptionRepository.save(shippingOption);
        } catch (e) {
            handler.logger.error('Error adding shipping option', e);
        }

        //sort out region fulfillment providers
        try {
            const fulfillmentProvider = await fulfillmentRepository.findOne({
                where: { id: 'store-fulfillment' },
            });
            if (fulfillmentProvider) {
                region.fulfillment_providers = [fulfillmentProvider];
                await regionRepository.save(region);
            }
        } catch (e) {
            handler.logger.error(
                'Error adding fulfillment provider to region',
                e
            );
        }

        return handler.returnStatusWithMessage(200, 'ok');
    });
};
