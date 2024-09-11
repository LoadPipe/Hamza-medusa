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

    @ManyToOne(() => Currency) // Setting up the relation to the Currency entity
    @JoinColumn({ name: 'currency_code' }) // Defines the foreign key column
    @Column({ unique: true })
    currency_code: string; // Foreign key to currency table

    @Column({ name: 'rate', type: 'float' })
    rate: number; // Floating point number for exchange rate

    @Column({ name: 'date_cached', type: 'timestamp' })
    date_cached: Date; // Timestamp for when the rate was cached

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'cached-exchange-rate');
    }
}
