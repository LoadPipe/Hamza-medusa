import { MigrationInterface, QueryRunner } from 'typeorm';

export class BuckyOrder3595867849494 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" ADD COLUMN "external_metadata" jsonb`
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD COLUMN "external_source" character varying`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" DROP COLUMN "external_metadata"`
        );
        await queryRunner.query(
            `ALTER TABLE "order" DROP COLUMN "external_source"`
        );
    }
}
