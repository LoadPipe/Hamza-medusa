import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHandleToStore1736410025552 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "store"
       ADD "handle" character varying NOT NULL DEFAULT ''`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "handle"`);
  }
}