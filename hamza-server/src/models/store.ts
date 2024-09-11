import { Entity, OneToOne, JoinColumn, Column } from 'typeorm';
import { Store as MedusaStore } from '@medusajs/medusa';
import { User } from './user';

@Entity()
export class Store extends MedusaStore {
    @OneToOne(() => User)
    @JoinColumn({ name: 'owner_id' })
    owner?: User;

    // Store already has a name field, let's make it unique, such that stores can be identified by their names
    @Column({ unique: true, nullable: false })
    name: string;

    @Column('owner_id')
    owner_id?: string;

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
