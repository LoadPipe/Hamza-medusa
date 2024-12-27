import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import {
    // alias the core entity to not cause a naming conflict
    Discount as MedusaDiscount,
} from '@medusajs/medusa';
import { Store } from './store';

@Entity()
export class Discount extends MedusaDiscount {
    @Column({ nullable: false, default: '' })
    store_id: string;

    @ManyToOne(() => Store)
    @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
    store?: Store;
}
