import { MigrationInterface, QueryRunner } from 'typeorm';

export class MassMarket2849489248924 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "store" ADD COLUMN "massmarket_store_id" VARCHAR NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "store" ADD COLUMN "massmarket_keycard" VARCHAR NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "product" ADD COLUMN "massmarket_prod_id" VARCHAR NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD COLUMN "massmarket_order_id" VARCHAR NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD COLUMN "massmarket_amount" VARCHAR NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD COLUMN "massmarket_ttl" BIGINT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "store" DROP COLUMN "massmarket_store_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "store" DROP COLUMN "massmarket_keycard"`
        );
        await queryRunner.query(
            `ALTER TABLE "product" DROP COLUMN "massmarket_prod_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "order" DROP COLUMN "massmarket_order_id"`
        );
        await queryRunner.query(
            `ALTER TABLE "order" DROP COLUMN "massmarket_amount"`
        );
        await queryRunner.query(
            `ALTER TABLE "order" DROP COLUMN "massmarket_ttl"`
        );
    }
}
