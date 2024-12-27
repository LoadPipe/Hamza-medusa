import { WalletAddress } from "../models/walletAddress";
import {
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const WalletAddressRepository = dataSource
  .getRepository(WalletAddress)
