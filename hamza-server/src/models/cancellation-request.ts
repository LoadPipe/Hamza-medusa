import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    BaseEntity,
} from 'typeorm';
import { Order } from './order';

@Entity('cancellation_requests')
export class CancellationRequest extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

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
}
