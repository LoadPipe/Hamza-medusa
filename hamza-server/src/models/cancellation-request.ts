import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    BaseEntity,
    PrimaryColumn,
    BeforeInsert,
} from 'typeorm';
import { Order } from './order';
import { generateEntityId } from '@medusajs/medusa';

@Entity('cancellation_request')
export class CancellationRequest extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @ManyToOne(() => Order, (order) => order.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ type: 'character varying', length: 255 })
    order_id: string;

    @Column({ type: 'varchar', length: 255 })
    reason: string;

    @Column({ type: 'text', nullable: true })
    buyer_note: string;

    @Column({ type: 'text', nullable: true })
    seller_note: string;

    @Column({
        type: 'enum',
        enum: ['requested', 'accepted', 'rejected'],
        default: 'requested',
    })
    status: 'requested' | 'accepted' | 'rejected';

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'cancreq');
    }
}
