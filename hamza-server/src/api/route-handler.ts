import type { MedusaRequest, MedusaResponse, Logger } from '@medusajs/medusa';
import { readRequestBody } from '../utils/request-body';

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
        if (inputFieldNames?.length) {
            this.inputParams = readRequestBody(req.body, inputFieldNames);
        }
    }

    public async handle(fn: (_this?: RouteHandler) => void) {
        try {
            this.logger.info(`******* ROUTE-HANDLER ********* ${this.method} ${this.route}`);
            await fn(this);
        }
        catch (err: any) {
            const errorInfo = `ERROR ${this.method} ${this.route}: ${err}`;
            this.logger.error({ message: errorInfo });
            this.response.status(500).json(errorInfo);
            if (this.onError)
                this.onError(err);
        }
    }
}