import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerifiedToCustomer1709792473378 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "customer" ADD COLUMN "is_verified" boolean NOT NULL DEFAULT false;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE "customer" DROP COLUMN "is_verified";
    `);
    }

}
