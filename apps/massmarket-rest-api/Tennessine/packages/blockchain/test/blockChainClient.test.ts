import { describe, beforeEach, expect, test } from "vitest";
import { BlockchainClient } from "@massmarket/blockchain";
import { random32BytesHex } from "@massmarket/utils";
import {
  createWalletClient,
  createPublicClient,
  http,
  type Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import * as abi from "@massmarket/contracts";

const account = privateKeyToAccount(
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
);

const wallet = createWalletClient({
  account,
  chain: hardhat,
  transport: http(),
});
const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(),
});

let blockChainClient: BlockchainClient;
const shopId = random32BytesHex();

beforeEach(async () => {
  blockChainClient = new BlockchainClient(shopId);
});

describe("blockChain Client", async () => {
  test("createShop", async () => {
    const transactionHash = await blockChainClient.createShop(wallet);
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
    });
    expect(receipt.status).equals("success");
  });
  test("setShopMetadataURI", async () => {
    const test_uri = "/testing/path";
    await blockChainClient.setShopMetadataURI(wallet, test_uri);

    const uri = await publicClient.readContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "tokenURI",
      args: [shopId],
    });

    expect(uri).toEqual(test_uri);
  });
});
