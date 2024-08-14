// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { MyContext } from "@/context/MyContext";
import { MockClient } from "../test/mockClient";
import { StoreContextProvider, useStoreContext } from "@/context/StoreContext";
import {
  render,
  act,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import Products from "@/app/products/page";
import { AuthContext } from "@/context/AuthContext";
import { IStatus } from "@/types";
import { getParsedMapData } from "@/utils/level";

const TestComponent = () => {
  const { db } = useStoreContext();
  const [price, setPrice] = useState("");
  const [stockQty, setStockQty] = useState(0);
  const [tagName, setTagName] = useState("");
  const getState = async () => {
    const data = await getParsedMapData("products", db);
    const tagsData = await getParsedMapData("tags", db);
    if (data) {
      const { value } = data.values().next();
      const tag = tagsData?.values().next().value;
      setStockQty(value.stockQty);
      setPrice(value.price);
      setTagName(tag.text);
    }
  };
  return (
    <div>
      <button onClick={getState}>Test Button</button>
      <p data-testid="price">{price}</p>
      <p data-testid="stockQty">{stockQty}</p>
      <p data-testid="tagName">{tagName}</p>
    </div>
  );
};
describe("StoreContext", () => {
  const client = new MockClient();

  vi.mock("next/navigation", () => ({
    useRouter() {
      return {
        route: "/",
        push: () => {},
      };
    },
    useSearchParams() {
      return {
        get: () => {},
      };
    },
  }));
  const Wrapper = () => {
    return (
      <AuthContext.Provider
        value={{
          isConnected: IStatus.Complete,
          setIsConnected: () => {},
          hasUpdateRootHashPerm: false,
          setUpdateRootHashPerm: () => {},
          isMerchantView: false,
          setIsMerchantView: () => {},
        }}
      >
        {/* @ts-expect-error FIXME */}
        <MyContext.Provider value={{ relayClient: client }}>
          <StoreContextProvider>
            {/* @ts-expect-error FIXME */}
            <Products />
            <TestComponent />
          </StoreContextProvider>
        </MyContext.Provider>
      </AuthContext.Provider>
    );
  };

  it("Receives and builds store state from streams", async () => {
    render(<Wrapper />);

    await act(async () => {
      await client.connect();
    });
    const item = screen.getByTestId("product-best schoes");
    expect(item).toHaveTextContent("best schoes");
    expect(item).toHaveTextContent("23.00");
    expect(item).toHaveTextContent("58 Available");
    //Testing LevelDb
    const button = screen.getByRole("button");
    fireEvent.click(button);
    await waitFor(() => {
      const savedPrice = screen.getByTestId("price");
      expect(savedPrice).toHaveTextContent("23.00");
      const savedStockQty = screen.getByTestId("stockQty");
      expect(savedStockQty).toHaveTextContent("58");
      const savedTag = screen.getByTestId("tagName");
      expect(savedTag).toHaveTextContent("Tag1");
    });
  });
});
