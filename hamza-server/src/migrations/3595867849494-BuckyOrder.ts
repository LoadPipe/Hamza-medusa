import { MigrationInterface, QueryRunner } from 'typeorm';

export class MultiVendorOrder1907365738273 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" ADD COLUMN "bucky_order_no" VARCHAR NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD COLUMN "bucky_partner_order_no" VARCHAR NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "bucky_order_no"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "bucky_partner_order_no"`);
    }
}
