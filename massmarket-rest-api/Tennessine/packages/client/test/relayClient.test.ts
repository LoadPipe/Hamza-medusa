// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: MIT

import { WebSocket } from "isows";
import {
  bytesToHex,
  hexToBytes,
  createWalletClient,
  createPublicClient,
  http,
  type Address,
} from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { describe, beforeEach, expect, test } from "vitest";

import { RelayClient } from "../src";
import { random32BytesHex, randomBytes } from "../src/utils";
import * as abi from "@massmarket/contracts";

// this key is from one of anvil's default keypairs
const account = privateKeyToAccount(
  "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
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

const relayEndpoint =
  (process && process.env["RELAY_ENDPOINT"]) || "ws://localhost:4444/v2";

function createRelayClient() {
  return new RelayClient({
    shopId: random32BytesHex(),
    relayEndpoint,
    keyCardWallet: privateKeyToAccount(random32BytesHex()),
    keyCardEnrolled: false,
  });
}

describe("RelayClient", async () => {
  const relayClient = createRelayClient();
  describe("connection behavior", () => {
    test("should connect and disconnect", async () => {
      await relayClient.connect();
      const closeEvent = await relayClient.disconnect();
      const r = closeEvent as CloseEvent;
      expect(r.wasClean).toBe(true);
      await relayClient.disconnect();
    });

    test("should reconnect", async () => {
      await relayClient.disconnect();
      await relayClient.connect();
      expect(relayClient.connection.readyState).toBe(WebSocket.OPEN);
    });
  });

  test("should create a shop", async () => {
    const transactionHash = await relayClient.blockchain.createShop(wallet);
    // wait for the transaction to be included in the blockchain
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
    });
    expect(receipt.status).equals("success");
  });

  test("regstrationTokenRedeem", async () => {
    // still contrived, we would use a seperate keypair in reality and pass it via some sidechannel
    //
    // acc2 is the "long term wallet" of the new user
    // if we knew that before hand, we could just call registerUser(acc2.address, Clerk)
    const sk = random32BytesHex();
    const token = privateKeyToAccount(sk);
    const hash = await relayClient.blockchain.createInviteSecret(
      wallet,
      token.address,
    );

    // wait for the transaction to be included in the blockchain
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
    });

    expect(receipt.status).to.equal("success");
    const acc2 = privateKeyToAccount(sk);
    await wallet.sendTransaction({
      account,
      to: acc2.address,
      value: BigInt("250000000000000000"),
    });

    const client2Wallet = createWalletClient({
      account: acc2,
      chain: hardhat,
      transport: http(),
    });

    const relayClient2 = new RelayClient({
      relayEndpoint,
      keyCardWallet: privateKeyToAccount(sk),
      keyCardEnrolled: false,
      shopId: relayClient.blockchain.shopId,
    });

    const hash2 = await relayClient.blockchain.redeemInviteSecret(
      sk,
      client2Wallet,
    );
    // wait for the transaction to be included in the blockchain
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: hash2,
    });
    expect(transaction.status).to.equal("success");

    // verify access level
    const canUpdateRootHash = await publicClient.readContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "hasPermission",
      args: [
        relayClient.blockchain.shopId,
        acc2.address,
        abi.permissions.updateRootHash,
      ],
    });
    expect(canUpdateRootHash).toBe(true);
    const canRemoveUser = await publicClient.readContract({
      address: abi.addresses.ShopReg as Address,
      abi: abi.ShopReg,
      functionName: "hasPermission",
      args: [
        relayClient.blockchain.shopId,
        acc2.address,
        abi.permissions.removeUser,
      ],
    });
    expect(canRemoveUser).toBe(false);

    await relayClient2.disconnect();
  });
  await relayClient.disconnect();
});

describe("user behaviour", () => {
  const relayClient = createRelayClient();
  // enroll and login
  test("should enroll keycard", async () => {
    const transactionHash = await relayClient.blockchain.createShop(wallet);
    // wait for the transaction to be included in the blockchain
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: transactionHash,
    });
    expect(receipt.status).equals("success");
    const response = await relayClient.enrollKeycard(wallet);
    expect(response.status).toBe(201);
    const authenticated = await relayClient.connect();
    expect(authenticated.error).toBeNull();
  });

  test("write shop manifest", async () => {
    const publishedTagId = randomBytes(32);
    const name = "test shop";
    const description = "creating test shop";
    const profilePictureUrl = "https://http.cat/images/200.jpg";
    await relayClient.shopManifest({
      name,
      description,
      profilePictureUrl,
      publishedTagId,
    });
  });

  test("update shop manifest", async () => {
    await relayClient.updateShopManifest({ domain: "socks.mass.market" });
    await relayClient.updateShopManifest({
      publishedTagId: randomBytes(32),
    });
    await relayClient.updateShopManifest({
      name: "socks.mass.market",
      description: "foo",
    });

    await relayClient.updateShopManifest({
      addAcceptedCurrency: {
        tokenAddr: hexToBytes(abi.addresses.Eddies as Address),
        chainId: 31337,
      },
    });
    await relayClient.updateShopManifest({
      removeAcceptedCurrency: {
        tokenAddr: hexToBytes(abi.addresses.Eddies as Address),
        chainId: 31337,
      },
    });
  });

  test("blob upload", async () => {
    const file = new File(["foo"], "foo.txt", {
      type: "text/plain",
    });
    const formData = new FormData();
    formData.append("file", file);
    const result = await relayClient.uploadBlob(formData);
    expect(result.ipfs_path).toBe(
      "/ipfs/QmcJw6x4bQr7oFnVnF6i8SLcJvhXjaxWvj54FYXmZ4Ct6p",
    );
  });

  describe("editing the listing", () => {
    let itemId: Uint8Array;
    // create item
    beforeEach(async () => {
      const metadata = new TextEncoder().encode(
        JSON.stringify({
          name: "test",
          description: "test",
          image: "https://http.cat/images/200.jpg",
        }),
      );
      itemId = await relayClient.createItem({
        price: "10.99",
        metadata,
      });
      expect(itemId).not.toBeNull();
    });

    test("update item - price", async () => {
      await relayClient.updateItem({ itemId, price: "20.99" });
      expect(itemId).not.toBeNull();
    });

    test("update item - metadata", async () => {
      await relayClient.updateItem({
        itemId,
        metadata: new TextEncoder().encode(
          JSON.stringify({
            name: "new name",
            image: "https://http.cat/images/200.jpg",
          }),
        ),
      });
      expect(itemId).not.toBeNull();
    });

    describe("tagging", () => {
      let tagId: Uint8Array;
      beforeEach(async () => {
        tagId = await relayClient.createTag({ name: "Testing New Tag" });
        expect(tagId).not.toBeNull();
      });
      test("add item to tag", async () => {
        await relayClient.updateTag({ tagId, addItemId: itemId });
      });
      test("remove item from tag", async () => {
        await relayClient.updateTag({ tagId, removeItemId: itemId });
      });
    });

    describe("checkout process", () => {
      let orderId: Uint8Array;
      beforeEach(async () => {
        orderId = await relayClient.createOrder();
        // increase stock
        await relayClient.changeStock({
          itemIds: [itemId],
          diffs: [10],
        });
      });

      test("single item checkout", { timeout: 10000 }, async () => {
        await relayClient.updateShopManifest({
          addAcceptedCurrency: {
            tokenAddr: hexToBytes(abi.addresses.Eddies as Address),
            chainId: 31337,
          },
          addPayee: {
            addr: hexToBytes(abi.addresses.Eddies as Address),
            callAsContract: false,
            chainId: 31337,
            name: "test",
          },
        });

        await relayClient.updateOrder({
          orderId,
          changeItems: {
            itemId,
            quantity: 1,
          },
        });
        const checkout = await relayClient.commitOrder({
          orderId,
          currency: {
            tokenAddr: hexToBytes(abi.addresses.Eddies as Address),
            chainId: 31337,
          },
          payeeName: "test",
        });
        expect(checkout).not.toBeNull();
        expect(checkout.orderFinalizedId).not.toBeNull();

        const getStream = async () => {
          const stream = relayClient.createEventStream();
          for await (const event of stream) {
            if (event.event.updateOrder?.itemsFinalized) {
              return bytesToHex(event.event.updateOrder.orderId);
            }
          }
          return null;
        };
        const receivedId = await getStream();
        expect(receivedId).toEqual(bytesToHex(orderId));
      });

      test("erc20 checkout", async () => {
        await relayClient.updateOrder({
          orderId,
          changeItems: {
            itemId,
            quantity: 1,
          },
        });

        const checkout = await relayClient.commitOrder({
          orderId,
          currency: {
            tokenAddr: hexToBytes(abi.addresses.Eddies as Address),
            chainId: 31337,
          },
          payeeName: "test",
        });
        expect(checkout).not.toBeNull();
        expect(checkout.orderFinalizedId).not.toBeNull();
      });
    });
  });

  describe("invite another user", { retry: 3 }, async () => {
    let client2Wallet;
    let relayClient2: RelayClient;
    beforeEach(async () => {
      const sk = random32BytesHex();
      const token = privateKeyToAccount(sk);
      const hash = await relayClient.blockchain.createInviteSecret(
        wallet,
        token.address,
      );

      // wait for the transaction to be included in the blockchain
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      expect(receipt.status).to.equal("success");
      const acc2 = privateKeyToAccount(sk);
      await wallet.sendTransaction({
        account,
        to: acc2.address,
        value: BigInt("250000000000000000"),
      });
      client2Wallet = createWalletClient({
        account: acc2,
        chain: hardhat,
        transport: http(),
      });
      relayClient2 = new RelayClient({
        relayEndpoint,
        keyCardWallet: privateKeyToAccount(sk),
        keyCardEnrolled: false,
        shopId: relayClient.blockchain.shopId,
      });
      const redeemHash = await relayClient.blockchain.redeemInviteSecret(
        sk,
        client2Wallet,
      );
      // wait for the transaction to be included in the blockchain
      const redeemReceipt = await publicClient.waitForTransactionReceipt({
        hash: redeemHash,
      });

      expect(redeemReceipt.status).to.equal("success");
      await relayClient2.enrollKeycard(client2Wallet);
      await relayClient2.connect();
    });

    test("client2 successfully updates manifest", async () => {
      await relayClient2.updateShopManifest({
        domain: "test2-test",
      });
    });

    test("client 2 receives events from createEventStream", async () => {
      const getStream = async () => {
        const stream = relayClient2.createEventStream();
        for await (const evt of stream) {
          return 1;
        }
      };
      const evtLength = await getStream();
      expect(evtLength).toBeGreaterThan(0);
    });
  });
});
