// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { EventEmitter } from "events";
import { hexToBytes } from "viem";

import testVectorsData from "./testVectors.json" with { type: "json" };

import schema, { google } from "@massmarket/schema";

type VectorEvent = {
  type: string;
  // actually all combinations are known but depends on 'type', not sure how to map this.
  // Might not be necessary to access these for these tests, tho.
  object: any;
  signature: string;
  hash: string;
  encoded: string;
};

export type VectorItems = {
  [key: string]: {
    price: string;
    metadata: string;
    tag_id: string[];
    stock_qty: number;
  };
};

export type TestVectors = {
  signatures: {
    signer_address: string;
  };
  events: VectorEvent[];
  reduced: {
    manifest: {
      shop_token_id: string;
      domain: string;
      published_tag: { [key: string]: { text: string } };
    };
    // keycard_id -> user_wallet
    keycards: { [key: string]: string };
    // item_id -> { price, metadata }
    items: VectorItems;
    // items assigned to the published tag
    published_items: string[];
    // cart_id -> item_id -> quantity
    open_orders: { [key: string]: { [key: string]: number } };
    // item_id -> quantity
    inventory: { [key: string]: number };
  };
};

export type IncomingEvent = {
  request: schema.EventPushRequest;
  done: () => void;
};

export class MockClient extends EventEmitter {
  vectors: TestVectors;

  constructor() {
    super();
    this.vectors = testVectorsData;
    console.log(
      `[vectors] events: ${JSON.stringify(this.vectors.events.length)}`,
    );
  }

  async connect() {
    for (let index = 0; index < this.vectors.events.length; index++) {
      const evt = this.vectors.events[index];
      const decodedEvent = schema.ShopEvent.decode(
        hexToBytes(("0x" + evt.encoded) as `0x${string}`),
      );
      const pushReq = new schema.EventPushRequest({
        requestId: sequentialReqId(),
        events: [decodedEvent as google.protobuf.IAny],
      });
      this.emit("event", pushReq);
    }
  }
  createEventStream() {
    const parentInstance = this;
    let enqueueFn: any;
    const enqueueWrapperFn = (controller: any) => {
      return (enqueueFn = (events: any) => {
        for (const event of events) {
          controller.enqueue(event);
        }
      });
    };

    return new ReadableStream(
      {
        start(controller) {
          try {
            parentInstance.on("event", enqueueWrapperFn(controller));
          } catch (error) {
            console.log({ error });
          }
        },

        cancel() {
          parentInstance.removeListener("event", enqueueFn);
        },
      },
      { highWaterMark: 0 },
    );
  }
}

let reqIdCounter: number = 1;
function sequentialReqId() {
  const reqIdSize = 16;
  const bytes = new Uint8Array(16);
  let bigint = BigInt(reqIdCounter);
  for (let i = 0; i < reqIdSize; i++) {
    bytes[reqIdSize - 1 - i] = Number(bigint & BigInt(0xff));
    bigint >>= BigInt(reqIdSize);
  }
  reqIdCounter++;
  return bytes;
}
