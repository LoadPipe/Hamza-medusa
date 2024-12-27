import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from '@medusajs/medusa';
import { generateEntityId } from '@medusajs/medusa/dist/utils';
import { Customer } from './customer';

@Entity({ name: 'confirmation_token' })
export class ConfirmationToken {
    @PrimaryColumn()
    token: string;

    @Column()
    email_address: string;

    @Column({ default: false })
    redeemed: boolean;

    @Column({ default: 3 })
    expiration_hours: number;

    @ManyToOne(() => Customer, (customer) => customer.walletAddresses, {
        nullable: false,
    })
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @Column({ type: 'varchar', name: 'customer_id' })
    customer_id: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
