import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTrackingNumberToOrderTable1737531915707 implements MigrationInterface{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" ADD COLUMN "tracking_number" VARCHAR NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" DROP COLUMN "tracking_number"`
        );
    }
}