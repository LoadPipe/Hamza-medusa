import { describe, assert, expect, test } from "vitest";
import { ReadableEventStream } from "../src/stream";
import { privateKeyToAccount } from "viem/accounts";
import { hexToBytes } from "viem";

import schema, { PBObject, PBMessage, PBInstance } from "@massmarket/schema";

const account = privateKeyToAccount(
  "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
);

async function signMessage(message: PBObject) {
  const shopEventBytes = schema.ShopEvent.encode(message).finish();
  const sig = await account.signMessage({
    message: { raw: shopEventBytes },
  });
  const signedEvent = {
    signature: hexToBytes(sig),
    event: {
      type_url: "type.googleapis.com/market.mass.ShopEvent",
      value: shopEventBytes,
    },
  };
  return signedEvent;
}

class MockClient {
  encodeAndSendNoWait(
    encoder: PBMessage,
    object: PBObject = {},
  ): Promise<PBInstance> {
    return Promise.resolve(encoder.encode(object).finish());
  }
}

describe("Stream", async () => {
  test("Stream Creation", async () => {
    const testCreateItem = {
      updateItem: {
        eventId: Buffer.from([1, 2, 3, 4]),
        price: "1000",
        metadata: Buffer.from([1, 2, 3, 4]),
      },
    };
    const signedMessage = await signMessage(testCreateItem);
    const pushEvent = {
      requestId: Uint8Array.from([1, 2, 3, 4]),
      events: [signedMessage],
    };
    const client = new MockClient();
    const stream = new ReadableEventStream(client);
    stream.enqueue(pushEvent);
    for await (const evt of stream.stream) {
      assert.deepEqual(
        evt.event.updateItem,
        schema.UpdateItem.create(testCreateItem.updateItem),
      );
      expect(evt.signer).toEqual(account.address);
      break;
    }

    stream.enqueue(pushEvent);
    for await (const _ of stream.stream) {
      // should not emit after close
      assert.fail();
    }
  });

  test("Stream Cancel ", () => {
    assert.doesNotThrow(async () => {
      const testCreateItem = {
        updateItem: {
          eventId: Buffer.from([1, 2, 3, 4]),
          price: "1000",
          metadata: Buffer.from([1, 2, 3, 4]),
        },
      };
      const signedMessage = await signMessage(testCreateItem);
      const pushEvent = {
        requestId: Uint8Array.from([1, 2, 3, 4]),
        events: [signedMessage, signedMessage],
      };
      const client = new MockClient();
      const stream = new ReadableEventStream(client);
      stream.enqueue(pushEvent);
      const reader = stream.stream.getReader();
      await reader.read();
      reader.cancel();
    });
  });
});
