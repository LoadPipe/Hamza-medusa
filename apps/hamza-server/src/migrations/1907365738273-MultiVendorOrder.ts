import { MigrationInterface, QueryRunner } from 'typeorm';

export class MultiVendorOrder1907365738273 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" ADD COLUMN "store_id" VARCHAR NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "order" ADD CONSTRAINT "FK_Order_Store" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE`
        );
        await queryRunner.query(
            `ALTER TABLE "order" DROP CONSTRAINT "REL_c99a206eb11ad45f6b7f04f2dc"`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" DROP CONSTRAINT "FK_Order_Store"`
        );
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "store_id"`);
        await queryRunner.query(
            `ALTER TABLE "order" ADD CONSTRAINT "REL_c99a206eb11ad45f6b7f04f2dc" UNIQUE ("cart_id")`
        );
    }
}
