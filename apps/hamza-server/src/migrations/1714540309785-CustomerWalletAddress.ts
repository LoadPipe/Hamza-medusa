import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CustomerWalletAddress1714540309785 implements MigrationInterface {
    name = "CustomerWalletAddress1714540309785";
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'customer_wallet_address',
            columns: [
                {
                    name: 'wallet_address',
                    type: 'varchar',
                    isPrimary: true
                },
                {
                    name: 'customer_id',
                    type: 'varchar',
                    isNullable: true
                }
            ],
            foreignKeys: [
                {
                    columnNames: ['customer_id'],
                    referencedTableName: 'customer',
                    referencedColumnNames: ['id'],
                    onDelete: 'SET NULL'
                }
            ]
        }), true);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('customer_wallet_address');
    }
}
