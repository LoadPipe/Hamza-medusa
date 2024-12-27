import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { CustomerWalletAddress } from '../models/customer-wallet-address';

export const CustomerWalletAddressRepository = dataSource.getRepository(CustomerWalletAddress);

export default CustomerWalletAddressRepository;
