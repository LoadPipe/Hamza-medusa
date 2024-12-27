import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import {
    // alias the core entity to not cause a naming conflict
    ProductCollection as MedusaProductCollection,
} from '@medusajs/medusa';
import { Store } from './store';

@Entity()
export class ProductCollection extends MedusaProductCollection {
    @Column({ nullable: false, default: '' })
    store_id: string;

    @ManyToOne(() => Store)
    @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
    store?: Store;
}
