// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import withAuth from "../components/withAuth";
import { useStoreContext } from "@/context/StoreContext";
import { IStatus, ItemId } from "@/types";
import { OrderState } from "@/context/types";

function Page() {
  const [totalEarnings, setTotalEarnings] = useState<number>(255.4);
  const [currency, setCurrency] = useState<string>("");
  const { orderItems, products } = useStoreContext();

  //FIXME: for when we integrate store settings
  useEffect(() => {
    setCurrency("USDC");
  }, []);

  useEffect(() => {
    const carts = Array.from([...orderItems.values()]);
    let _totalEarnings = 0;
    carts.map((cartState: OrderState) => {
      if (cartState.status === IStatus.Complete) {
        const items: [string, number][] = Object.entries(cartState.items);
        items.map((i: [string, number]) => {
          const itemId = i[0] as ItemId;
          _totalEarnings += Number(products.get(itemId)?.price) * i[1];
        });
      }
    });
    setTotalEarnings(_totalEarnings);
  }, [orderItems]);

  return (
    <main className="bg-gray-100 p-4 pt-under-nav h-screen">
      <section className="pt-4">
        <div className="text-center">
          <p>Earnings</p>
          <div>
            <h1 className="text-4xl mt-6">
              {totalEarnings} {currency}
            </h1>
            <p className="text-gray-500">Total earnings</p>
          </div>
        </div>
        <section className="flex justify-evenly my-6">
          <div className="py-4 px-6 bg-gray-200 rounded">
            <p className="text-xs">Today&apos;s Sales</p>
            <div className="flex gap-2 my-2">
              <Image
                src="/assets/dollar-avatar.svg"
                width={24}
                height={24}
                alt="dollar-avatar"
                className="h-6"
              />
              <p>{totalEarnings}</p>
            </div>
            <div className="flex">
              <Image
                src="/assets/green-up-arrow.svg"
                width={16}
                height={16}
                alt="green-up-arrow"
                className="h-6"
              />
              <p className="font-sans text-green-700">TBD</p>
            </div>
          </div>
          <div className="py-4 px-6 bg-gray-200 rounded">
            <p className="text-xs">Total sales</p>
            <div className="flex gap-2  my-2">
              <Image
                src="/assets/dollar-avatar.svg"
                width={24}
                height={24}
                alt="dollar-avatar"
                className="h-6"
              />
              <p>{totalEarnings}</p>
            </div>
            <div className="flex">
              <Image
                src="/assets/green-up-arrow.svg"
                width={16}
                height={16}
                alt="green-up-arrow"
                className="h-6"
              />
              <p className="font-sans text-green-700">TBD</p>
            </div>
          </div>
        </section>
        <section className="mt-8">
          <p className="font-sans">Earnings breakdown</p>
          <div className="border-b-2 text-gray-500">
            <div className="flex gap-4 mb-4 mt-6">
              <Image
                src="/assets/dollar-avatar.svg"
                width={24}
                height={24}
                alt="dollar-avatar"
                className="h-6"
              />
              <p>USDC</p>
              <p className="ml-auto">{totalEarnings}</p>
            </div>
            <div className="flex gap-4 mb-4">
              <Image
                src="/assets/dollar-avatar.svg"
                width={24}
                height={24}
                alt="dollar-avatar"
                className="h-6"
              />
              <p>Eth</p>
              <p className="ml-auto">TBD</p>
            </div>
            <div className="flex gap-4 mb-4">
              <Image
                src="/assets/arb-avatar.svg"
                width={24}
                height={24}
                alt="eth-avatar"
                className="h-6"
              />
              <p>ARB</p>
              <p className="ml-auto">TBD</p>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <p>Total Earnings</p>
            <p>
              {totalEarnings} {currency}
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
export default withAuth(Page);
