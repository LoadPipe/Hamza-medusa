import { MigrationInterface, QueryRunner } from 'typeorm';

export class StoreEscrowContract1784923758602 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "store" ADD "escrow_contract_address" character varying`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "store" DROP COLUMN "escrow_contract_address"`
        );
    }
}
