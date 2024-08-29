import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AppLogs2986572957694 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "app_log" ( 
            "id" character varying NOT NULL,
            "session_id" character varying,
            "request_id" character varying,
            "customer_id" character varying,
            "log_level" character varying,
            "text" character varying,
            "content" character varying,
            "timestamp" int,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "deleted_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_gknmp6lnikxobwv1rhv1dgs912" PRIMARY KEY ("id") )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE "app_log"`
        );
    }
}
