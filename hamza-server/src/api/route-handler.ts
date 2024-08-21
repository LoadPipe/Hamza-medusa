import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../utils/request-body';

/**
 * Provides uniformity of logging and exception handling for all API routes.
 * Should be used for handling all api routes.
 */
export class RouteHandler {
    logger: Logger;
    inputParams: any;
    method: string;
    route: string;
    request: MedusaRequest;
    response: MedusaResponse;
    onError: (err: any) => void = null;

    constructor(
        req: MedusaRequest,
        res: MedusaResponse,
        method: string,
        route: string,
        inputFieldNames: string[] = []
    ) {
        this.logger = req.scope.resolve('logger');
        this.method = method;
        this.route = route;
        this.request = req;
        this.response = res;
        this.inputParams = {};

        if (inputFieldNames?.length) {
            this.inputParams = readRequestBody(req.body, inputFieldNames);
        }

        // Extract parameters from URL
        if (req.params) {
            this.inputParams = { ...this.inputParams, ...req.params };
        }

        if (req.query) {
            this.inputParams = { ...this.inputParams, ...req.query };
        }
    }

    public async handle(fn: (_this?: RouteHandler) => void) {
        try {
            this.logger.info(
                `******* ROUTE-HANDLER ********* ${this.method} ${this.route}`
            );
            this.logger.debug(
                `Input Params: ${JSON.stringify(this.inputParams)}`
            );
            await fn(this);
        } catch (err: any) {
            const errorInfo = `ERROR ${this.method} ${this.route}: ${err}`;
            this.logger.error({ message: errorInfo });
            this.response.status(500).json(errorInfo);
            if (this.onError) this.onError(err);
        }
    }
}
