import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { SoftDeletableEntity } from '@medusajs/medusa';
import { generateEntityId } from '@medusajs/medusa/dist/utils';

@Entity()
export class AppLog extends SoftDeletableEntity {
    @PrimaryColumn()
    id: string;

    @Column({ name: 'session_id' })
    session_id: string;

    @Column({ name: 'request_id' })
    request_id: string;

    @Column({ name: 'customer_id' })
    customer_id: string;

    @Column({ name: 'log_level' })
    log_level: string;

    @Column({ name: 'text' })
    text: string;

    @Column({ name: 'content' })
    content: string;

    @Column({ name: 'timestamp' })
    timestamp: number;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'log');
    }
}
