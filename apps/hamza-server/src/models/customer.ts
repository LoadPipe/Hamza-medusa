import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import {
    Currency,
    // alias the core entity to not cause a naming conflict
    Customer as MedusaCustomer,
} from '@medusajs/medusa';
import { CustomerWalletAddress } from './customer-wallet-address';
import { CustomerNotification } from './customer-notification';

@Entity()
export class Customer extends MedusaCustomer {
    @Column({ nullable: false, default: false })
    is_verified: boolean;

    // @Column({ nullable: true })
    // email?: string;

    @ManyToOne((type) => Currency, { nullable: true })
    @JoinColumn({ name: 'preferred_currency_id' })
    preferred_currency?: Currency;

    @Column('preferred_currency_id')
    preferred_currency_id?: string;

    @OneToMany(
        () => CustomerWalletAddress,
        (walletAddress) => walletAddress.customer
    )
    walletAddresses: CustomerWalletAddress[];

    @OneToMany(
        () => CustomerNotification,
        (notification) => notification.customer
    )
    notifications: CustomerNotification[];

    @BeforeInsert()
    private assignRandomCurrency(): void {
        //const currencies = ['eth', 'usdt', 'usdc'];
        this.preferred_currency_id = 'usdt'; //currencies[Math.floor(Math.random() * currencies.length)];
    }
}
