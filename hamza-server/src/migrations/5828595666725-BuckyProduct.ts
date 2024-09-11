import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class BuckyProduct5828595666725 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "product" ADD "bucky_metadata" jsonb`,
        );
        await queryRunner.query(
            `ALTER TABLE "product_variant" ADD "bucky_metadata" jsonb`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "product" DROP COLUMN "bucky_metadata"`
        );
        await queryRunner.query(
            `ALTER TABLE "product_variant" DROP COLUMN "bucky_metadata"`
        );
    }
}
