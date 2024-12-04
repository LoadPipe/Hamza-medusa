import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import {
    // alias the core entity to not cause a naming conflict
    ProductVariant as MedusaProductVariant,
} from '@medusajs/medusa';

@Entity()
export class ProductVariant extends MedusaProductVariant {
    @Column()
    external_source?: string;

    @Column('jsonb')
    external_metadata?: Record<string, unknown>;

    @Column('jsonb')
    bucky_metadata?: Record<string, unknown>;
}
