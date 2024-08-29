import { generateEntityId, Logger } from '@medusajs/medusa';
import { AppLog } from 'src/models/app-log';
import { AppLogRepository } from 'src/repositories/app-log';

export interface ILogger {
    debug(log: any);
    info(log: any);
    warn(log: any);
    error(log: any, error?: any);
}

export class DatabaseLogger implements ILogger {
    private readonly logger: Logger;
    private readonly sessionId: string;
    private readonly repository: typeof AppLogRepository;

    constructor(container, sessionId?: string) {
        this.logger = container.logger;
        this.sessionId = sessionId;
        this.repository = container.appLogRepository;
    }

    debug(text: any) {
        this.saveEntry(text, 'debug');
        if (process.env.LOG_TO_CONSOLE)
            this.logger?.debug(text);
    }

    info(text: any) {
        this.saveEntry(text, 'info');
        if (process.env.LOG_TO_CONSOLE)
            this.logger?.info(text);
    }

    warn(text: any) {
        this.saveEntry(text, 'warn');
        if (process.env.LOG_TO_CONSOLE)
            this.logger?.warn(text);
    }

    error(text: any, error?: any) {
        this.saveEntry(text, 'error', error);
        if (process.env.LOG_TO_CONSOLE)
            this.logger?.error(text, error);
    }

    private saveEntry(text: string, log_level: string, content?: any) {
        if (process.env.LOG_TO_DATABASE) {
            const entry = {
                text,
                session_id: this.sessionId,
                log_level,
                content,
                timestamp: 1,
                id: generateEntityId()
            }

            this.repository?.save(entry);
        }
    }
}

export function createLogger(config: any, sessionId?: string) {
    return new DatabaseLogger(config, sessionId);
}