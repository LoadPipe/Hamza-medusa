import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConfirmedColumnToRefund1733389346570 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "refund" ADD "confirmed" BOOLEAN DEFAULT false`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refund" DROP COLUMN "confirmed"`);
    }

}
