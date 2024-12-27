import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CancellationRequest1733812644853 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "cancellation_request" (
            "id" character varying NOT NULL,
            "order_id" character varying NOT NULL,
            "reason" character varying NOT NULL,
            "buyer_note" character varying,
            "seller_note" character varying,
            "status" character varying NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now())`
        );
        await queryRunner.query(
            `ALTER TABLE "cancellation_request" ADD CONSTRAINT "FK_Cancellation_Request_Order" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE SET NULL ON UPDATE CASCADE`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('cancellation_request');
    }
}
