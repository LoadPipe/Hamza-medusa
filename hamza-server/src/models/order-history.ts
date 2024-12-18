import {
    BaseEntity,
    BeforeInsert,
    Column,
    Entity,
    PrimaryColumn,
} from 'typeorm';
import { generateEntityId } from '@medusajs/medusa/dist/utils';

@Entity()
export class OrderHistory extends BaseEntity {
    constructor() {
        super();
        if (!this.id) this.beforeInsert();
    }

    @PrimaryColumn()
    id: string;

    @Column({ name: 'order_id' })
    order_id: string;

    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'to_status' })
    to_status: string;

    @Column({ name: 'to_payment_status' })
    to_payment_status: string;

    @Column({ name: 'to_fulfillment_status' })
    to_fulfillment_status: string;

    @Column({ name: 'to_escrow_status' })
    to_escrow_status: string;

    @Column('jsonb')
    metadata?: Record<string, unknown>;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'hist');
    }
}
