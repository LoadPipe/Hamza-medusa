import { type MedusaRequest, type MedusaResponse, type Logger, generateEntityId } from '@medusajs/medusa';
import { readRequestBody } from '../utils/request-body';
import jwt from 'jsonwebtoken';
import { createLogger, ILogger } from '../utils/logging/logger';
import { AppLogRepository } from 'src/repositories/app-log';

/**
 * Provides uniformity of logging and exception handling for all API routes.
 * Should be used for handling all api routes.
 */
export class RouteHandler {
    logger: ILogger;
    inputParams: any;
    method: string;
    route: string;
    request: MedusaRequest;
    response: MedusaResponse;
    jwtToken: any;
    customerId: string;
    onError: (err: any) => void = null;

    constructor(
        req: MedusaRequest,
        res: MedusaResponse,
        method: string,
        route: string,
        inputFieldNames: string[] = []
    ) {

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

        //handle security
        this.jwtToken = jwt.decode(req.headers.authorization);
        this.customerId = this.jwtToken?.customer_id;

        //create the logger
        const logger: Logger = req.scope.resolve('logger');
        const appLogRepository: typeof AppLogRepository = req.scope.resolve('appLogRepository');

        const loggerContext: any = {
            logger,
            appLogRepository
        }

        this.logger = createLogger(loggerContext, `${this.method} ${this.route}`);
    }

    async handle(fn: (_this?: RouteHandler) => any) {
        try {
            this.logger.info(
                `Input Params: ${JSON.stringify(this.inputParams)}`
            );
            const response: any = await fn(this);
        } catch (err: any) {
            const errorInfo = `ERROR ${JSON.stringify(err)}`;
            this.returnStatusWithMessage(500, errorInfo);
            if (this.onError) this.onError(err);
        }
    }

    returnStatus(status: number, payload: any) {
        if (status == 500)
            this.logger.error(`Returning ${status} with ${JSON.stringify(payload)}`);
        else
            this.logger.info(`Returning ${status} with ${JSON.stringify(payload)}`);
        return this.response.status(status).json(payload);
    }

    returnStatusWithMessage(status: number, message: string) {
        return this.returnStatus(status, { message });
    }

    enforceCustomerId(
        customerId: string = null,
        requireValue: boolean = false
    ): boolean {
        if (!process.env.ENFORCE_ROUTE_IDENTITY) return true;

        if (!requireValue && !customerId?.length) {
            return true;
        }

        const unauthorized: boolean = !customerId
            ? !this.customerId
            : !this.customerId || this.customerId !== customerId;

        if (unauthorized) {
            this.logger.warn(
                `Unauthorized customer for route call ${this.method} ${this.route}`
            );
            this.returnStatusWithMessage(401, `Unauthorized customer ${this.customerId}`);
        } else {
            console.log('customer ', this.customerId, ' is authorized');
        }

        return !unauthorized;
    }

    requireParams(params: string[]): boolean {
        const missingParams = [];

        if (process.env.VALIDATE_ROUTE_PARAMS) {
            for (let p of params) {
                if (!this.hasParam(p)) missingParams.push(p);
            }

            if (missingParams.length) {
                this.logger?.warn(`Call rejected for missing params: ${JSON.stringify(missingParams)}`)
                const message = `missing required param(s): ${missingParams.join()}`;
                this.returnStatusWithMessage(400, message);
                return false;
            }
        }

        return true;
    }

    requireParam(param: string): boolean {
        return this.requireParams([param]);
    }

    hasParam(param): boolean {
        return this.inputParams[param]?.length ? true : false;
    }
}
