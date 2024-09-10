import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
import { SoftDeletableEntity } from '@medusajs/medusa';
import { generateEntityId } from '@medusajs/medusa/dist/utils';

// - endpoint: string → the url endpoint (e.g. /api/v1/order/details)
// - input: jsonb → the json that we sent in the request
// - output: jsonb → the response that came back
// - context: jsonb → optional, leave blank for now. This I expect we will use to indicate from where, for what customer, etc.

@Entity('bucky_logs')
export class BuckyLog extends SoftDeletableEntity {
    @PrimaryColumn()
    id: string;

    @Column({ name: 'endpoint' })
    endpoint: string;

    // Storing JSON data in binary format
    // TS type system doesn't know about `jsonb`
    @Column({ name: 'input', type: 'jsonb' })
    input: any;

    @Column({ name: 'output', type: 'jsonb' })
    output?: any;

    @Column({ name: 'context', type: 'jsonb' })
    context?: any;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'log');
    }
}
