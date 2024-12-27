import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStoreIdToProduct1712575204173 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product"
                ADD "store_id" character varying`,
    );
    await queryRunner.query(
      `CREATE INDEX "ProductStoreId" ON "product" ("store_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product"
                ADD CONSTRAINT "fk_product_store" FOREIGN KEY ("store_id") REFERENCES "store"("id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."ProductStoreId"`);
    await queryRunner.query(`ALTER TABLE "product"
            DROP COLUMN "store_id"`);
    await queryRunner.query(
      `ALTER TABLE "product"
                DROP CONSTRAINT "fk_product_store"`,
    );
  }
}
