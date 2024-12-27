import { Customer } from "../models/customer";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import { CustomerRepository as MedusaCustomerRepository } from "@medusajs/medusa/dist/repositories/customer";

export const CustomerRepository = dataSource
  .getRepository(Customer)
  .extend({
    // it is important to spread the existing repository here.
    //  Otherwise you will end up losing core properties
    ...Object.assign(MedusaCustomerRepository, {
      target: Customer,
    }),

    async findByWalletAddress(wallet_address: string) {
      return this.findOne({
        where: { wallet_address },
        relations: {
          preferred_currency: true
        }
      })
    },
  })


export default CustomerRepository