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

    //@OneToMany(() => WhitelistItem, (whitelistItem) => whitelistItem.whitelist, {
    //    onDelete: 'CASCADE',
    //})
    //items: WhitelistItem[];
}

/*
@Entity()
@Unique(['whitelist_id', 'customer_address'])
export class WhitelistItem extends BaseEntity {
    @Column()
    whitelist_id: string;

    @ManyToOne(() => WhiteList, (whitelist) => whitelist.items)
    @JoinColumn({ name: 'whitelist_id' })
    whitelist: WhiteList;

    @Column()
    customer_address: string;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'wi');
    }
}
*/

