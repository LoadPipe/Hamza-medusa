import { CartEmail } from '../models/cart-email';
import { dataSource } from '@medusajs/medusa/dist/loaders/database';

export const CartEmailRepository = dataSource.getRepository(CartEmail);
