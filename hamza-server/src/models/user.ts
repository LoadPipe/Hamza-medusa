import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
} from 'typeorm';
import { User as MedusaUser } from '@medusajs/medusa';
import { WalletAddress } from './walletAddress';
import { Store } from './store';
import { Role } from './role';
// For a simple solution, we're not going to extend (User Entity roles) from Medusa's User Entity
// `admin` will have all permissions
// `member` will have limited permissions; they will act as vendors
// Vendors will only have access to their own products
// TODO: https://docs.medusajs.com/modules/users/backend/rbac
@Entity()
export class User extends MedusaUser {
    @Index()
    @Column({ nullable: true })
    role_id: string | null;

    @Column()
    store_id: string;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: 'role_id' })
    team_role: Role | null;

    @OneToOne(() => Store, (store) => store.owner)
    owned_store?: Store;

    @ManyToOne(() => Store)
    @JoinColumn({ name: 'store_id' })
    store: Store;

    @Column()
    wallet_address: string;
    // email?: string;
    // password_hash?: string;
}
