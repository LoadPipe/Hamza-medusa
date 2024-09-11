import { Entity, OneToOne, JoinColumn, Column } from 'typeorm';
import { Payment as MedusaPayment } from '@medusajs/medusa';

@Entity()
export class Payment extends MedusaPayment {
    @Column()
    transaction_id?: string;

    @Column()
    receiver_address?: string;

    @Column()
    payer_address?: string;

    @Column()
    escrow_contract_address?: string;

    @Column()
    chain_id?: number;
}
