import {
    Entity, Column, ManyToOne, BeforeInsert, OneToMany,
    JoinColumn,
    Unique,
} from 'typeorm';
import { SoftDeletableEntity } from '@medusajs/medusa';
import { generateEntityId } from '@medusajs/medusa/dist/utils';
import { BaseEntity } from '@medusajs/medusa';

@Entity()
export class WhiteList extends SoftDeletableEntity {
    @Column()
    store_id: string;

    @Column()
    wallet_address: string;

    @OneToMany(() => WhitelistItem, (whitelistItem) => whitelistItem.whitelist, {
        onDelete: 'CASCADE',
    })
    items: WhitelistItem[];

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'whitelist');
    }
}

@Entity()
@Unique(['whitelist_id', 'customer_address'])
export class WhitelistItem extends BaseEntity {
    @Column()
    wishlist_id: string;

    @ManyToOne(() => WhiteList, (whitelist) => whitelist.items)
    @JoinColumn({ name: 'wishlist_id' })
    whitelist: WhiteList;

    @Column()
    customer_address: string;
}

