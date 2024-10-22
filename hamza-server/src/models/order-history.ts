import { BaseEntity, BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { generateEntityId } from '@medusajs/medusa/dist/utils';
import { FulfillmentStatus, OrderStatus, PaymentStatus } from '@medusajs/medusa';

@Entity()
export class OrderHistory extends BaseEntity {

    constructor() {
        super();
        if (!this.id)
            this.beforeInsert();
    }

    @PrimaryColumn()
    id: string;

    @Column({ name: 'order_id' })
    order_id: string;

    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'to_status' })
    to_status: OrderStatus;

    @Column({ name: 'to_payment_status' })
    to_payment_status: PaymentStatus;

    @Column({ name: 'to_fulfillment_status' })
    to_fulfillment_status: FulfillmentStatus;

    @Column('jsonb')
    metadata?: Record<string, unknown>;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId('id', 'hist');
    }
}
