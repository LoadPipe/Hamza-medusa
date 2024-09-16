import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('cart_email')
export class CartEmail extends BaseEntity {

    @PrimaryColumn()
    id: string;

    @Column({ name: 'email_address' })
    email_address: string;
}
