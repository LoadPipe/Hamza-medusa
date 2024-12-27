import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import {
    // alias the core entity to not cause a naming conflict
    LineItem as MedusaLineItem,
} from '@medusajs/medusa';

@Entity()
export class LineItem extends MedusaLineItem {
    @Column({ nullable: false, default: '' })
    currency_code: string;

    @Column()
    external_order_id: number;
}
