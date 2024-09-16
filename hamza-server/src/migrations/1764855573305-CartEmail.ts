import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CartEmail1764855573305 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "cart_email" ( 
            "id" character varying NOT NULL,
            "email_address" character varying,
            CONSTRAINT "PK_gknmp6lnigjkskgfghssahv1dgs912" PRIMARY KEY ("cart_id") )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE "cart_email"`
        );
    }
}
