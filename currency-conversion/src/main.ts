import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const logger = new Logger('Bootstrap');

    try {
        const app = await NestFactory.create<NestFastifyApplication>(
            AppModule,
            new FastifyAdapter(),
        );

        await app.listen(process.env.port || 3000, '0.0.0.0');
        logger.log('Application is listening on port 3000');
    } catch (error) {
        logger.error('Failed to bootstrap the application', error.stack);
    }
}

bootstrap();
