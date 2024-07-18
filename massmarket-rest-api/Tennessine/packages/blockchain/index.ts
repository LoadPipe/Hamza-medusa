// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import {
  bytesToHex,
  hexToBytes,
  Address,
  type WalletClient,
  type Transport,
  type Account,
  type Chain,
} from "viem";

import * as abi from "@massmarket/contracts";
import { eventId } from "@massmarket/utils";
import { privateKeyToAccount } from "viem/accounts";

export type WalletClientWithAccount = WalletClient<
  Transport,
  Chain,
  Account
> & {
  account: Account;
};

export class BlockchainClient {
  constructor(public shopId = bytesToHex(eventId())) {}

  createShop(wallet: WalletClientWithAccount) {
    return wallet.writeContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "mint",
      args: [BigInt(this.shopId), wallet.account.address],
    });
  }

  setShopMetadataURI(wallet: WalletClientWithAccount, uri: string) {
    return wallet.writeContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "setTokenURI",
      args: [BigInt(this.shopId), uri],
    });
  }

  createInviteSecret(wallet: WalletClientWithAccount, token: Address) {
    // Save the public key onchain
    return wallet.writeContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "publishInviteVerifier",
      args: [BigInt(this.shopId), token],
    });
  }

  async redeemInviteSecret(secret: Address, wallet: WalletClientWithAccount) {
    const message = "enrolling:" + wallet.account.address.toLowerCase();
    const tokenAccount = privateKeyToAccount(secret);
    const sig = await tokenAccount.signMessage({
      message,
    });
    const sigBytes = hexToBytes(sig);
    const v = sigBytes[64];
    const r = bytesToHex(sigBytes.slice(0, 32));
    const s = bytesToHex(sigBytes.slice(32, 64));
    return wallet.writeContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "redeemInvite",
      args: [BigInt(this.shopId), v, r, s, wallet.account.address],
    });
  }
}
