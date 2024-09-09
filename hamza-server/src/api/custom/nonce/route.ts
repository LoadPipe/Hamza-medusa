import { SiweMessage, generateNonce } from 'siwe';
import { ConfigModule } from '@medusajs/medusa';
import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { RouteHandler } from '../../route-handler';

type MyConfigModule = ConfigModule & {
    projectConfig: {
        nonce?: string;
    };
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const handler: RouteHandler = new RouteHandler(
        req,
        res,
        'GET',
        '/custom/nonce'
    );

    await handler.handle(async () => {
        const nonce = generateNonce();
        req.session.nonce = nonce;
        await req.session.save();
        handler.returnStatus(200, req.session.nonce);
    });
};
