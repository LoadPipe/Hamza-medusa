import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UserStor1749488828370 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD store_id VARCHAR NULL`);
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_User_Store" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user" DROP CONSTRAINT "FK_User_Store"`
        );
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "store_id" `);
    }
}
