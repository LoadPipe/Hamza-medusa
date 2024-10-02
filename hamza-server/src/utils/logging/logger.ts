import { generateEntityId, Logger } from '@medusajs/medusa';
import { AppLog } from 'src/models/app-log';
import { AppLogRepository } from 'src/repositories/app-log';
import { sessionStorage } from '../context';

export interface ILogger {
    debug(log: any);
    info(log: any);
    warn(log: any);
    error(log: any, error?: any);
}

export class DatabaseLogger implements ILogger {
    private readonly logger: Logger;
    private readonly repository: typeof AppLogRepository;
    private readonly prefix: string;

    constructor(container: any, prefix?: string) {
        this.logger = container.logger;
        this.repository = container.appLogRepository;
        this.prefix = prefix ?? '';
    }

    debug(text: any) {
        text = this.prefix?.length ? `${this.prefix}: ${text}` : text;
        this.saveEntry(text, 'debug');
        if (process.env.LOG_TO_CONSOLE)
            this.logger?.debug(text);
    }

    info(text: any) {
        text = this.prefix?.length ? `${this.prefix}: ${text}` : text;
        this.saveEntry(text, 'info');
        if (process.env.LOG_TO_CONSOLE)
            this.logger?.info(text);
    }

    warn(text: any) {
        text = this.prefix?.length ? `${this.prefix}: ${text}` : text;
        this.saveEntry(text, 'warn');
        if (process.env.LOG_TO_CONSOLE)
            this.logger?.warn(text);
    }

    error(text: any, error?: any) {
        text = this.prefix?.length ? `${this.prefix}: ${text}` : text;
        this.saveEntry(text, 'error', error);
        if (process.env.LOG_TO_CONSOLE)
            this.logger?.error(text, error);
    }

    private saveEntry(text: string, log_level: string, content?: any) {
        if (process.env.LOG_TO_DATABASE) {
            const entry = {
                text,
                session_id: sessionStorage.sessionId,
                customer_id: sessionStorage.customerId,
                request_id: sessionStorage.requestId,
                log_level,
                content,
                timestamp: Math.floor(Date.now() / 1000),
                id: generateEntityId()
            }

            this.repository?.save(entry);
        }
    }
}

export function createLogger(config: any, prefix?: string) {
    return new DatabaseLogger(config, prefix);
}