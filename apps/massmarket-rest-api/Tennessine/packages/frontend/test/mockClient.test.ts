// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { expect, test, vi, describe } from "vitest";

import { MockClient, type VectorItems } from "./mockClient";
import { buildState } from "../src/utils/buildState";
import {
  productReducer,
  productAction,
  updateProductAction,
} from "../src/reducers/productReducers";
import { allTagsReducer, allTagsAction } from "../src/reducers/tagReducers";
import { orderReducer, allOrderActions } from "../src/reducers/orderReducers";
import {
  finalizedOrderActions,
  finalizedOrderReducer,
} from "../src/reducers/finalizedOrderReducers";
import { pubKeyReducer, pubKeyAction } from "../src/reducers/KCPubKeysReducers";
import { storeReducer, updateStoreDataAction } from "@/reducers/storeReducer";

describe("mockclient", async () => {
  const client = new MockClient();
  let storeData = { name: "", profilePictureUrl: "", baseCurrencyAddr: null };
  let products = new Map();
  let allTags = new Map();
  let orderItems = new Map();
  let publishedTagId = null;
  const events = [];
  let finalizedOrders = new Map();
  let pubKeys: `0x${string}`[] = [];
  function productsDispatch(action: productAction | updateProductAction) {
    products = productReducer(products, action);
  }
  function tagsDisaptch(action: allTagsAction) {
    allTags = allTagsReducer(allTags, action);
  }
  function setOrderItems(action: allOrderActions) {
    orderItems = orderReducer(orderItems, action);
  }
  function setPublishedTagId(id: `0x${string}` | null) {
    publishedTagId = id;
    console.log(`publishedTagId set to: ${publishedTagId}`);
  }
  function setFinalizedOrders(action: finalizedOrderActions) {
    finalizedOrders = finalizedOrderReducer(finalizedOrders, action);
  }
  function setPubKeys(action: pubKeyAction) {
    pubKeys = pubKeyReducer(pubKeys, action);
  }
  function setStoreData(action: updateStoreDataAction) {
    //@ts-expect-error FIXME
    storeData = storeReducer(storeData, action);
  }

  client.on("event", (e) => {
    events.push(e.request);
    buildState(
      products,
      allTags,
      e.events,
      productsDispatch,
      tagsDisaptch,
      setOrderItems,
      setPublishedTagId,
      setFinalizedOrders,
      setPubKeys,
      setStoreData,
    );
  });

  await client.connect();
  const vectorItems: VectorItems = client.vectors.reduced.items;

  await vi.waitUntil(async () => {
    return events.length == client.vectors.events.length;
  });

  const testItemsMap = new Map(Object.entries(vectorItems));
  const testDataKeysArr = Array.from([...testItemsMap.keys()]);
  const testTagsMap = new Map(
    Object.entries(client.vectors.reduced.manifest.published_tag),
  );
  const productsMapKeysArr = Array.from([...products.keys()]);

  test("Correctly builds a map of all products", () => {
    //first item
    expect(products.size).toEqual(testItemsMap.size);
    expect(products.get(productsMapKeysArr[0]).price).toEqual(
      testItemsMap.get(testDataKeysArr[0])?.price,
    );
    const testData = testItemsMap.get(testDataKeysArr[0])?.metadata as string;
    const productsData = products.get(productsMapKeysArr[0]).metadata;
    expect(productsData.title).toEqual(JSON.parse(testData).title);
    //second item

    const testData2 = testItemsMap.get(testDataKeysArr[1])?.metadata as string;
    const productsData2 = products.get(productsMapKeysArr[1]).metadata;
    expect(products.get(productsMapKeysArr[1]).price).toEqual(
      testItemsMap.get(testDataKeysArr[1])?.price,
    );
    expect(productsData2.image).toEqual(JSON.parse(testData2).image);
  });

  test("Correctly builds a map of all tags", () => {
    const allTagsKeysArr = Array.from([...allTags.keys()]);
    const firstTagId = allTags.get(allTagsKeysArr[0]).id;
    //chop off '0x'
    const idToHex = firstTagId.slice(2);
    expect(testTagsMap.size).toEqual(allTags.size);
    expect(testTagsMap.get(idToHex)?.text).toEqual(
      allTags.get(firstTagId).text,
    );
  });

  test("Add a product to tag", () => {
    const firstItemTagIds = products.get(productsMapKeysArr[0]).tagIds;
    //chop off '0x'
    const idToHex = firstItemTagIds[0].slice(2);
    expect(firstItemTagIds[0]).toContain(
      testItemsMap.get(testDataKeysArr[0])?.tag_id[0],
    );
    const tag = allTags.get(firstItemTagIds[0]);
    const testTag = testTagsMap.get(idToHex);
    expect(tag.text).toEqual(testTag?.text);
  });

  test("Remove product from tag", () => {
    expect(products.get(productsMapKeysArr[1]).tagIds).toEqual(
      testItemsMap.get(testDataKeysArr[1])?.tag_id,
    );
  });

  test("Create order", () => {
    const testDataOrderObj = client.vectors.reduced.open_orders;
    const testDataFirstOrderId = Object.keys(testDataOrderObj)[0];
    const testDataFirstOrderItemId = Object.keys(
      testDataOrderObj[testDataFirstOrderId],
    )[0];
    const orderExists = orderItems.get(`0x${testDataFirstOrderId}`);
    expect(orderExists.items).toBeTruthy();
    expect(orderExists.items[`0x${testDataFirstOrderItemId}`]).toEqual(
      testDataOrderObj[testDataFirstOrderId][testDataFirstOrderItemId],
    );
  });

  test("Change stock of item", () => {
    expect(products.get(productsMapKeysArr[0]).stockQty).toEqual(
      testItemsMap.get(testDataKeysArr[0])?.stock_qty,
    );
    expect(products.get(productsMapKeysArr[1]).stockQty).toEqual(
      testItemsMap.get(testDataKeysArr[1])?.stock_qty,
    );
  });
});
