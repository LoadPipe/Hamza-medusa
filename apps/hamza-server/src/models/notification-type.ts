import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@medusajs/medusa';
import { generateEntityId } from '@medusajs/medusa/dist/utils';

@Entity()
export class NotificationType extends BaseEntity {
    @Column({ unique: true })
    name: string;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'notification-type');
    }
}
