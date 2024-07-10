// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { useEffect, useState } from "react";
import FullModal from "@/app/common/components/FullModal";
import Image from "next/image";
import { useStoreContext } from "@/context/StoreContext";
import { IProduct, ItemId } from "@/types";
import { ItemState } from "@/context/types";
import { useMyContext } from "@/context/MyContext";

const TransactionDetails = ({
  closeDetails,
  order,
  opened,
  transactionHash,
}: {
  closeDetails: () => void;
  opened: boolean;
  order: ItemState;
  transactionHash: `0x${string}` | null;
}) => {
  if (!opened) return null;

  const [totalProductsPrice, setTotalPrice] = useState<number>(0);
  const items = Object.entries(order);
  const { products } = useStoreContext();
  const { publicClient } = useMyContext();
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");

  useEffect(() => {
    let total = 0;
    items.map((i) => {
      const qty = i[1];
      const itemId = i[0] as ItemId;
      const p = products.get(itemId) as IProduct;
      total += qty * Number(p.price);
    });
    setTotalPrice(total);
    setSymbol("USDC");
  }, []);

  const formatTime = (hour: number) => {
    if (hour < 12) return { hour, AM: true };
    else return { hour: hour - 12, AM: false };
  };

  useEffect(() => {
    (async () => {
      if (!transactionHash) return;
      const transaction =
        publicClient &&
        transactionHash &&
        (await publicClient.getTransaction({
          hash: transactionHash,
        }));

      if (!transaction) return;
      const block = await publicClient?.getBlock({
        blockHash: transaction.blockHash,
      });
      console.log({ transaction, block });

      const unixTimeStamp = Number(block?.timestamp);
      const timestamp = new Date(unixTimeStamp * 1000);
      const { hour, AM } = formatTime(timestamp.getHours());
      const min = timestamp.getMinutes();
      setTime(`${hour}:${min < 10 ? "0" : ""}${min} ${AM ? "AM" : "PM"}`);
      const date = timestamp.toDateString();
      setDate(date);
      // if(erc20Addr) {
      //   const {name, symbol} = await getTokenName(erc20Addr)
      //   console.log({name, symbol})
      //   symbol && setSymbol(symbol)
      // }
    })();
  }, [transactionHash]);

  const renderProduct = (itemId: ItemId, quantity: number) => {
    const product = products.get(itemId) as IProduct;
    return (
      <div key={product.metadata.name} className="flex gap-1">
        {product.metadata.image && (
          <div className="border p-1 rounded">
            <Image
              src={product.metadata.image}
              width={64}
              height={64}
              alt="item-thumbnail"
              unoptimized={true}
            />
          </div>
        )}
        <div className="flex flex-col ml-4">
          <p>{product.metadata.name}</p>
          <p className="text-sm">{Number(product.price) * quantity} USDC</p>
          <p className="text-sm text-gray-400">QTY: {quantity}</p>
        </div>
      </div>
    );
  };

  const orderTotal = totalProductsPrice.toFixed(2);
  return (
    <FullModal
      isOpen={opened}
      onClose={closeDetails}
      header="Transaction Details"
      modalBgColor="gray-100"
    >
      <section>
        <section className="py-4 bg-white p-2">
          <div className="m-4">
            <h4>{orderTotal} USDC</h4>
            <p className="text-sm text-gray-500">
              {date && time && date + " at " + time}
            </p>
          </div>
        </section>
        <section className="mt-4 flex flex-col gap-8 bg-white">
          <div className="mx-4 py-4 flex flex-col gap-3">
            {items.map((i) => renderProduct(i[0] as ItemId, i[1]))}
          </div>
        </section>
        <section id="payment" className="mt-8">
          <h5 className="font-sans m-4">Payment Method</h5>
          <div className="p-4 bg-white flex gap-2 items-center">
            <Image
              src={`/assets/dollar-avatar.svg`}
              width={32}
              height={32}
              alt="item-thumbnail"
              unoptimized={true}
            />
            <p>{symbol}</p>
            <p className="ml-auto">{orderTotal}</p>
          </div>
        </section>
        <section id="summary" className="mt-8">
          <h5 className="font-sans m-4">Transaction Summary</h5>
          <div className="px-4 py-6 bg-white flex flex-col gap-4">
            <div className="flex">
              <p>Products</p>
              <p className="ml-auto">{totalProductsPrice} USDC</p>
            </div>
          </div>
        </section>
      </section>
    </FullModal>
  );
};

export default TransactionDetails;
