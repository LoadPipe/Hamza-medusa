import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductCollection1990838575665 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            //TODO: make nullable after we've created our own admin
            `ALTER TABLE "product_collection" ADD COLUMN "store_id" VARCHAR NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "product_collection" ADD CONSTRAINT "FK_Product_Collection_Store" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "product_collection" DROP CONSTRAINT "FK_Product_Collection_Store"`
        );
        await queryRunner.query(
            `ALTER TABLE "product_collection" DROP COLUMN "store_id"`
        );
    }
}
