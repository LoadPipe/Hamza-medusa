import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class StoreShippingSpec5822859621748 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "store_shipping_spec" ( 
            "id" character varying NOT NULL,
            "store_id" character varying NOT NULL,
            "spec" jsonb NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            CONSTRAINT "PK_store_shipping_spec_pk" PRIMARY KEY ("id") )`
        );

        await queryRunner.query(
            `ALTER TABLE "store_shipping_spec" ADD CONSTRAINT "FK_Store_Shipping_Spec_Store" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE SET NULL ON UPDATE CASCADE`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "store_shipping_spec" DROP CONSTRAINT "FK_Store_Shipping_Spec_Store"`
        );
        await queryRunner.query(`DROP TABLE "store_shipping_spec"`);
    }
}
