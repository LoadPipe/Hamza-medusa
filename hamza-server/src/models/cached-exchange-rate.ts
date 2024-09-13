import {
    BeforeInsert,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
} from 'typeorm';
import { BaseEntity, Currency } from '@medusajs/medusa';
import { generateEntityId } from '@medusajs/medusa/dist/utils';

// cached_exchange_rate
//
// - currency_code: FK to currency table (unique)
// - rate: number (floating point)
// - date_cached

@Entity()
export class CachedExchangeRate extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @ManyToOne(() => Currency)
    @JoinColumn({ name: 'from_currency_code' })
    from_currency_code: string;

    @ManyToOne(() => Currency)
    @JoinColumn({ name: 'to_currency_code' })
    to_currency_code: string;

    @Column({ name: 'rate', type: 'float' })
    rate: number; // Floating point number for exchange rate

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'cached-exchange-rate');
    }
}
