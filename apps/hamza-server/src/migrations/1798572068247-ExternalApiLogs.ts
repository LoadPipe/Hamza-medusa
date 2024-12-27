import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExternalLogs1725491792885 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "external_api_logs"(
                "id" character varying NOT NULL,
                "api_source" character varying NOT NULL,
                "endpoint" character varying NOT NULL,
                "input" jsonb,
                "output" jsonb,
                "context" jsonb, 
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_EXTERNAL_API_LOGS" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "external_api_logs"`);
    }
}
