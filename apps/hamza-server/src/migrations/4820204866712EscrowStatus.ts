import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class EscrowStatus4820204866712 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" ADD "escrow_status" character varying`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" DROP COLUMN "escrow_status"`
        );
    }
}
