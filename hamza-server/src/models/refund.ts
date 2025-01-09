import { Entity, Column } from 'typeorm';
import { Refund as MedusaRefund } from '@medusajs/medusa';

@Entity()
export class Refund extends MedusaRefund {
    @Column({ type: 'boolean', default: false })
    confirmed?: boolean;
}
