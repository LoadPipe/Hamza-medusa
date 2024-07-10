import {
    BeforeInsert,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { BaseEntity } from '@medusajs/medusa';
import { generateEntityId } from '@medusajs/medusa/dist/utils';
import { Customer } from '@medusajs/medusa/dist/models/customer';

@Entity()
export class CustomerNotification extends BaseEntity {
    readonly object = 'customer_notification';

    @Index()
    @Column({ nullable: false })
    customer_id: string;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @Column({ name: 'notification_type' })
    notification_type: string;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'notification');
    }
}
