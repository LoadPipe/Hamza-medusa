import { MigrationInterface, QueryRunner } from "typeorm";

export class BigNumberMoneyAmounts1715010783066 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "money_amount"
            ALTER COLUMN "amount" TYPE INT8`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "money_amount"
            ALTER COLUMN "amount" TYPE INT4`
        );
    }

}
