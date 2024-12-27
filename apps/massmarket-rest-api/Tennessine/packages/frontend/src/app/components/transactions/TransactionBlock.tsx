// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IStatus, ItemId, IProduct } from "@/types";
import { useStoreContext } from "@/context/StoreContext";
import { ItemState } from "@/context/types";
import { useMyContext } from "@/context/MyContext";

export function TransactionBlock({
  order,
  onClick,
  orderStatus,
  transactionHash,
  searchPhrase,
}: {
  order: ItemState;
  onClick: (order: ItemState, hash: `0x${string}` | null) => void;
  orderStatus: IStatus;
  transactionHash: `0x${string}` | null;
  searchPhrase: string;
}) {
  const { products } = useStoreContext();
  const { publicClient } = useMyContext();
  const [time, setTime] = useState("N/A");
  const [includeBlock, setIncludeBlock] = useState(true);

  const formatTime = (hour: number) => {
    if (hour < 12) return { hour, AM: true };
    else return { hour: hour - 12, AM: false };
  };

  useEffect(() => {
    setIncludeBlock(true);
  }, [searchPhrase]);

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
      const unixTimeStamp = Number(block?.timestamp);
      const timestamp = new Date(unixTimeStamp * 1000);
      const { hour, AM } = formatTime(timestamp.getHours());
      const min = timestamp.getMinutes();
      setTime(`${hour}:${min} ${AM ? "AM" : "PM"}`);
    })();
  }, [transactionHash]);

  const items = Object.entries(order);
  let status = "text-gray-500";

  switch (orderStatus) {
    case IStatus.Failed:
      status = "text-red-500";
      break;
    case IStatus.Pending:
      status = "text-gray-500";
      break;
    case IStatus.Complete:
      status = "text-green-500";
      break;
    default:
      break;
  }

  const renderProduct = (itemId: ItemId) => {
    const product = products.get(itemId) as IProduct;
    if (!product) return null;
    if (searchPhrase?.length) {
      const phraseIsInTitle = product.metadata.name.includes(searchPhrase);
      if (!phraseIsInTitle) setIncludeBlock(false);
    }

    return (
      <div key={product.metadata.name} className="border rounded p-1">
        {product.metadata.image && (
          <Image
            src={product.metadata.image}
            width={64}
            height={64}
            alt="information-icon"
            unoptimized={true}
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src = "/assets/no-image.png";
            }}
          />
        )}
      </div>
    );
  };

  if (!includeBlock) return;

  return (
    <section
      data-testid="transaction-block"
      className="p-4 bg-white"
      onClick={() => onClick(order, transactionHash)}
    >
      <div className="mb-4 flex flex-row justify-between">
        <div>
          <p className={`text-sm`}>
            status:
            <span className={status}>{orderStatus || IStatus.Pending}</span>
          </p>
          <p className="text-sm">Tx placed:{time}</p>
        </div>
        <button>
          <Image
            src={`/assets/forward-arrow.svg`}
            width={24}
            height={24}
            alt="information-icon"
            unoptimized={true}
          />
        </button>
      </div>
      <div className="flex gap-1">
        {items.map((i) => renderProduct(i[0] as ItemId))}
      </div>
    </section>
  );
}
export default TransactionBlock;
