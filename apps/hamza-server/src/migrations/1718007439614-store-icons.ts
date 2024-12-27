import { MigrationInterface, QueryRunner } from 'typeorm';
import { ORDER_CART_ALREADY_EXISTS_ERROR } from '@medusajs/medusa/dist/services/order';

export class StoreIcons1718007439614 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "store" ADD "icon" character varying`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store" DROP COLUMN "icon"`);
    }
}
