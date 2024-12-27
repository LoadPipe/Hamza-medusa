import { Entity, Column, ManyToOne, BeforeInsert } from 'typeorm';
import { SoftDeletableEntity } from '@medusajs/medusa';
import { generateEntityId } from '@medusajs/medusa/dist/utils';

import { User } from './user';

@Entity()
export class WalletAddress extends SoftDeletableEntity {
    //TODO: Add validation to the address field
    @Column({ unique: true })
    walletAddress!: string;

    // @ManyToOne(() => User, user => user.walletAddresses)
    // user!: User;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, 'walletAddress');
    }
}
