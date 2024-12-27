import { MigrationInterface, QueryRunner } from "typeorm";

export class CustomerPreferredCurrency1714457381585 implements MigrationInterface {
    name = 'CustomerPreferredCurrency1714457381585';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add preferred_currency_id column
        await queryRunner.query(`
            ALTER TABLE "customer"
            ADD COLUMN IF NOT EXISTS "preferred_currency_id" varchar;
        `);

        // Create a foreign key relation
        await queryRunner.query(`
            ALTER TABLE "customer"
            ADD CONSTRAINT "fk_customer_currency"
            FOREIGN KEY ("preferred_currency_id") REFERENCES "currency"("code");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove foreign key relation
        await queryRunner.query(`
            ALTER TABLE "customer"
            DROP CONSTRAINT "fk_customer_currency";
        `);

        // Remove preferred_currency_id column
        await queryRunner.query(`
            ALTER TABLE "customer"
            DROP COLUMN "preferred_currency_id";
        `);
    }
}
