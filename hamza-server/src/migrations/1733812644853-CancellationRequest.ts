import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CancellationRequest1733812644853 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'cancellation_requests',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'order_id',
                        type: 'character varying',
                        isNullable: false,
                    },
                    {
                        name: 'reason',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'buyer_note',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'seller_note',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'enum',
                        enum: ['requested', 'accepted', 'rejected'],
                        default: `'requested'`,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ['order_id'],
                        referencedTableName: 'order',
                        referencedColumnNames: ['id'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('cancellation_requests');
    }
}
