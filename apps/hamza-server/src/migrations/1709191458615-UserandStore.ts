import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStoreOwnerId1681287255173 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "store" ADD "owner_id" character varying`
        );
        await queryRunner.query(
            `ALTER TABLE "store" ADD CONSTRAINT "UQ_Store_Owner" UNIQUE ("owner_id")`
        );
        await queryRunner.query(
            `ALTER TABLE "store" ADD CONSTRAINT "FK_Store_Owner" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`
        );

        await queryRunner.query(
            `ALTER TABLE "store" ADD CONSTRAINT name_unique UNIQUE (name)`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "store" DROP CONSTRAINT "FK_Store_Owner"`
        );
        await queryRunner.query(
            `ALTER TABLE "store" DROP CONSTRAINT "UQ_Store_Owner"`
        );
        await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "owner_id"`);

        await queryRunner.query(
            `ALTER TABLE "store" DROP CONSTRAINT name_unique`
        );
    }
}
