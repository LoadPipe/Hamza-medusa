import { Entity, Column, ManyToOne, BeforeInsert } from 'typeorm';
import { SoftDeletableEntity } from '@medusajs/medusa';
import { generateEntityId } from '@medusajs/medusa/dist/utils';

@Entity()
export class WhiteList extends SoftDeletableEntity {
    @Column()
    store_id: string;

    @Column()
    wallet_address: string;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'whitelist');
    }
}
