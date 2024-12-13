import { Entity, OneToOne, JoinColumn, Column, OneToMany } from 'typeorm';
import { Store as MedusaStore } from '@medusajs/medusa';
import { User } from './user';
import { StoreShippingSpec } from './store-shipping-spec';

@Entity()
export class Store extends MedusaStore {
    @OneToOne(() => User)
    @JoinColumn({ name: 'owner_id' })
    owner?: User;

    @OneToMany(() => User, (user) => user.store, {
        onDelete: 'CASCADE',
    })
    users?: User[];

    @OneToMany(() => StoreShippingSpec, (spec) => spec.store, {
        onDelete: 'CASCADE',
    })
    shipping_specs?: StoreShippingSpec[];

    // Store already has a name field, let's make it unique, such that stores can be identified by their names
    @Column({ unique: true, nullable: false })
    name: string;

    @Column('owner_id')
    owner_id?: string;

    @Column('jsonb')
    escrow_metadata?: Record<string, unknown>;

    @Column()
    massmarket_store_id?: string;

    @Column()
    store_description?: string;

    @Column()
    store_followers?: number;

    @Column()
    massmarket_keycard?: string;

    @Column()
    icon: string;

    get numberOfFollowers(): number {
        // Hard-coded value for now
        return 100;
    }
}
