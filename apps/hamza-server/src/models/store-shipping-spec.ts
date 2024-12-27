import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { generateEntityId } from '@medusajs/medusa/dist/utils';
import { Store } from './store';

@Entity()
export class StoreShippingSpec extends BaseEntity {
    constructor() {
        super();
        if (!this.id) this.beforeInsert();
    }

    @PrimaryColumn()
    id: string;

    @Column({ name: 'store_id' })
    store_id: string;

    @ManyToOne(() => Store)
    @JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
    store?: Store;

    @Column('jsonb')
    spec?: Record<string, unknown>;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId('id', 'shipspec');
    }
}
