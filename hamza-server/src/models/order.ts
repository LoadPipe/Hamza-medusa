import { Entity, OneToOne, JoinColumn, Column } from 'typeorm';
import { Order as MedusaOrder } from '@medusajs/medusa';
import { Payment as MedusaPayment } from '@medusajs/medusa';
import { Store } from './store';
import { BigNumberish } from 'ethers';

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

    @Column()
    bucky_order_no?: string;

    @Column()
    bucky_partner_order_no?: string;
}
