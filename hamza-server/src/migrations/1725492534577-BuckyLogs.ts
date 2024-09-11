import { MigrationInterface, QueryRunner } from 'typeorm';

export class BuckyLogs1725491792885 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "bucky_logs"(
                "id" character varying NOT NULL,
                "endpoint" character varying NOT NULL,
                "input" jsonb,
                "output" jsonb,
                "context" jsonb, 
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_okumu5lnikxobwv1rhv1dgs912" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "bucky_logs"`);
    }
}
