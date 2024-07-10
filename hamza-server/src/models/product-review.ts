import { BaseEntity } from '@medusajs/medusa';
import {
    BeforeInsert,
    Column,
    Entity,
    OneToMany,
    Index,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Max, Min } from 'class-validator';
import { generateEntityId } from '@medusajs/medusa/dist/utils';
import { Order } from './order';
import { Customer } from '@medusajs/medusa/dist/models/customer';
import { Product } from './product';

@Entity()
export class ProductReview extends BaseEntity {
    @Index()
    @Column({ type: 'varchar', nullable: true })
    product_id: string;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Index()
    @Column({ nullable: true })
    customer_id: string;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @Index()
    @Column({ nullable: true })
    order_id: string;

    @ManyToOne(() => Order)
    @JoinColumn({ name: 'order_id' })
    order: Order; // Establish a many-to-one relationship with the Order entity

    @Column({ type: 'int' })
    @Min(1)
    @Max(5)
    rating: number;

    @Column({ nullable: false })
    content: string;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'prev');
    }
}
