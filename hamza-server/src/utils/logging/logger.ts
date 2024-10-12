import { generateEntityId, Logger } from '@medusajs/medusa';
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
    private readonly logTypes: string[];

    constructor(container: any, prefix?: string) {
        this.logger = container.logger;
        this.repository = container.appLogRepository;
        this.prefix = prefix ?? '';

        this.logTypes = process.env.LOG_TO_DATABASE ? process.env.LOG_TO_DATABASE.split(',') : [];
    }

    debug(text: any) {
        text = this.prefix?.length ? `${this.prefix}: ${text}` : text;
        this.saveEntry(text, 'debug');
        if (process.env.LOG_TO_CONSOLE && this.logTypes.includes('debug'))
            this.logger?.debug(text);
    }

    info(text: any) {
        text = this.prefix?.length ? `${this.prefix}: ${text}` : text;
        this.saveEntry(text, 'info');
        if (process.env.LOG_TO_CONSOLE && this.logTypes.includes('info'))
            this.logger?.info(text);
    }

    warn(text: any) {
        text = this.prefix?.length ? `${this.prefix}: ${text}` : text;
        this.saveEntry(text, 'warn');
        if (process.env.LOG_TO_CONSOLE && this.logTypes.includes('warn'))
            this.logger?.warn(text);
    }

    error(text: any, error?: any) {
        text = this.prefix?.length ? `${this.prefix}: ${text}` : text;
        this.saveEntry(text, 'error', error);
        if (process.env.LOG_TO_CONSOLE && this.logTypes.includes('error'))
            this.logger?.error(text, error);
    }

    private saveEntry(text: string, log_level: string, content?: any) {
        if (this.logTypes.includes(log_level)) {
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