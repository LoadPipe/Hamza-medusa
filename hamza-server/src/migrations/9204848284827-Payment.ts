import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class BuckyProduct5828595666725 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "payment" ADD "chain_id" bigint`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "payment" DROP COLUMN "chain_id"`
        );
    }
}
