import { MigrationInterface, QueryRunner } from 'typeorm';

export class BuckyOrder3595867849494 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "order" ADD COLUMN "bucky_metadata" jsonb`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "bucky_metadata"`);
    }
}
