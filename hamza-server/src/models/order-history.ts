import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';
import { generateEntityId } from '@medusajs/medusa/dist/utils';
import {
    FulfillmentStatus,
    OrderStatus,
    PaymentStatus,
} from '@medusajs/medusa';
import { Order } from './order';

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

    @ManyToOne(() => Order, (order) => order.histories, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
    order?: Order;

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

    @CreateDateColumn()
    created_at: Date;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'hist');
    }
}
