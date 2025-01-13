import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductOrder1708674950310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product"
                ADD "display_rank" integer NOT NULL DEFAULT 0`,
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product"
            DROP COLUMN "display_rank"`);

  }
}
