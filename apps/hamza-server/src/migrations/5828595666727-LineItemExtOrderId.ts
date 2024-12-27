import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class LineItemExternalOrderId5828595666727
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "line_item" ADD "external_order_id" integer GENERATED ALWAYS AS IDENTITY`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "line_item" DROP COLUMN "external_order_id"`
        );
    }
}
