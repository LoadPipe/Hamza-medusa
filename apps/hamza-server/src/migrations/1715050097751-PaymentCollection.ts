import { MigrationInterface, QueryRunner } from 'typeorm';

export class PaymentCollection1715050097751 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "payment_collection" ADD COLUMN "store_id" VARCHAR NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE "payment_collection" ADD CONSTRAINT "FK_payment_collection_store" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON UPDATE CASCADE`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
