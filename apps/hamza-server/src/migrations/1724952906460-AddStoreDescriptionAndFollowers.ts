import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStoreDescriptionAndFollowers1724952906460
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "store"
            ADD COLUMN IF NOT EXISTS "store_description" varchar;
        `);
        await queryRunner.query(`
            ALTER TABLE "store"
            ADD COLUMN IF NOT EXISTS "store_followers" integer; 
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "store"
                DROP COLUMN "store_description"
        `);
        await queryRunner.query(`
            ALTER TABLE "store"
                DROP COLUMN "store_followers"
        `);
    }
}
