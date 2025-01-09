import {
    Entity,
    OneToOne,
    JoinColumn,
    Column,
    OneToMany,
    Relation,
} from 'typeorm';
import { Order as MedusaOrder } from '@medusajs/medusa';
import { Store } from './store';
import { OrderHistory } from './order-history';

export const EscrowStatus = {
    IN_ESCROW: 'in_escrow',
    BUYER_RELEASED: 'buyer_released',
    SELLER_RELEASED: 'seller_released',
    RELEASED: 'released',
    REFUNDED: 'refunded',
};

@Entity()
export class Order extends MedusaOrder {
    @OneToOne(() => Store)
    @JoinColumn({ name: 'store_id' })
    store?: Store;

    @Column('store_id')
    store_id?: string;

    @Column()
    escrow_status?: string;

    @Column()
    massmarket_order_id?: string;

    @Column()
    massmarket_ttl?: number;

    @Column()
    massmarket_amount?: string;

    @Column('jsonb')
    external_metadata?: Record<string, unknown>;

    @OneToMany(() => OrderHistory, (orderHistory) => orderHistory.order, {
        cascade: true,
    })
    histories?: Relation<OrderHistory[]>;
}
