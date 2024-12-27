import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class ExternalSource5828595666726 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "product" ADD "external_metadata" jsonb`
        );
        await queryRunner.query(
            `ALTER TABLE "product_variant" ADD "external_metadata" jsonb`
        );
        await queryRunner.query(
            `ALTER TABLE "product" ADD "external_source" character varying`
        );
        await queryRunner.query(
            `ALTER TABLE "product_variant" ADD "external_source" character varying`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "product" DROP COLUMN "external_metadata"`
        );
        await queryRunner.query(
            `ALTER TABLE "product_variant" DROP COLUMN "external_metadata"`
        );
        await queryRunner.query(
            `ALTER TABLE "product" DROP COLUMN "external_source"`
        );
        await queryRunner.query(
            `ALTER TABLE "product_variant" DROP COLUMN "external_source"`
        );
    }
}
