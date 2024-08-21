import { MedusaRequest, MedusaResponse, OrderService, ShippingOptionPriceType, ShippingOptionService } from '@medusajs/medusa';
import { RouteHandler } from '../../../route-handler';
import ShippingOptionRepository from '@medusajs/medusa/dist/repositories/shipping-option';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const shippingOptionRepository: typeof ShippingOptionRepository = req.scope.resolve('shippingOptionRepository');

    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/admin/custom/bucky/setup'
    );

    await handler.handle(async () => {
        const shippingOption = await shippingOptionRepository.findOne({ where: { data: { "id": "bucky-fulfillment" } } });

        shippingOption.provider_id = 'bucky-fulfillment';
        shippingOption.price_type = ShippingOptionPriceType.CALCULATED;

        const output = await shippingOptionRepository.save(shippingOption);

        return res
            .status(201)
            .json({ status: true, output });
    });
};
