import { Entity, OneToOne, JoinColumn, Column } from 'typeorm';
import { Order as MedusaOrder } from '@medusajs/medusa';
import { Payment as MedusaPayment } from '@medusajs/medusa';
import { Store } from './store';

@Entity()
export class Order extends MedusaOrder {
    @OneToOne(() => Store)
    @JoinColumn({ name: 'store_id' })
    store?: Store;

    @Column('store_id')
    store_id?: string;

    @Column()
    massmarket_order_id?: string;

    @Column()
    massmarket_ttl?: number;

    @Column()
    massmarket_amount?: string;

    @Column('jsonb')
    bucky_metadata?: Record<string, unknown>;
}
