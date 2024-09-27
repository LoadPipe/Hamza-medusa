import { MigrationInterface, QueryRunner } from 'typeorm';

export class MultiVendorPayment1893867137584 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "payment" ADD COLUMN "blockchain_data" jsonb NULL`
        );
        await queryRunner.query(`DROP INDEX "UniquePaymentActive"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "payment" DROP COLUMN "blockchain_data"`
        );
    }
}
