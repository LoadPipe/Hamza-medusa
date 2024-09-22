import { Entity, OneToOne, JoinColumn, Column } from 'typeorm';
import { Payment as MedusaPayment } from '@medusajs/medusa';

@Entity()
export class Payment extends MedusaPayment {
    @Column('jsonb')
    blockchain_data?: Record<string, any>;
}
