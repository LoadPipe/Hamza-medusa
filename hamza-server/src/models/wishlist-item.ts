import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    Unique,
} from 'typeorm';
import { BaseEntity } from '@medusajs/medusa';
import { generateEntityId } from '@medusajs/medusa/dist/utils';
import { ProductVariant } from './product-variant';
import { Wishlist } from './wishlist';

@Entity()
@Unique(['wishlist_id', 'variant_id'])
export class WishlistItem extends BaseEntity {
    @Column()
    wishlist_id: string;

    @ManyToOne(() => Wishlist, (wishlist) => wishlist.items)
    @JoinColumn({ name: 'wishlist_id' })
    wishlist: Wishlist;

    @Column()
    variant_id: string;

    @ManyToOne(() => ProductVariant)
    @JoinColumn({ name: 'variant_id' })
    variant: ProductVariant;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'item');
    }
}
