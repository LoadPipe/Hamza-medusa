import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { SoftDeletableEntity } from '@medusajs/medusa';
import { generateEntityId } from '@medusajs/medusa/dist/utils';

@Entity()
export class CartEmail extends SoftDeletableEntity {

    @PrimaryColumn()
    cart_id: string;

    @Column({ name: 'email_address' })
    email_address: string;
}
