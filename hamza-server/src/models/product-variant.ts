import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import {
    // alias the core entity to not cause a naming conflict
    ProductVariant as MedusaProductVariant,
} from '@medusajs/medusa';

@Entity()
export class ProductVariant extends MedusaProductVariant {

    @Column()
    bucky_metadata?: string;
}
