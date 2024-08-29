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
        this.logger.debug(text);
    }

    info(text: any) {
        this.saveEntry(text, 'info');
        this.logger.info(text);
    }

    warn(text: any) {
        this.saveEntry(text, 'warn');
        this.logger.warn(text);
    }

    error(text: any, error?: any) {
        this.saveEntry(text, 'error', error);
        this.logger.error(text, error);
    }

    private saveEntry(text: string, log_level: string, content?: any) {
        const entry = {
            text,
            session_id: this.sessionId,
            log_level,
            content,
            timestamp: 1,
            id: generateEntityId()
        }

        this.repository.save(entry);
    }
}