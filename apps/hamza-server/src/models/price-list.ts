import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import {
    // alias the core entity to not cause a naming conflict
    PriceList as MedusaPriceList,
} from '@medusajs/medusa';
import { Store } from './store';

@Entity()
export class PriceList extends MedusaPriceList {
    @Column({ nullable: false, default: '' })
    store_id: string;

    @ManyToOne(() => Store)
    @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
    store?: Store;
}
