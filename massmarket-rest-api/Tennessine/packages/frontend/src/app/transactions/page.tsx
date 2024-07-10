// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { useEffect, useState } from "react";
import TransactionBlock from "@/app/components/transactions/TransactionBlock";
import TransactionDetails from "@/app/components/transactions/TransactionDetails";
import Search from "../common/components/Search";
import { OrderId, IStatus } from "@/types";
import withAuth from "../components/withAuth";
import { useStoreContext } from "@/context/StoreContext";
import { OrderState, ItemState } from "@/context/types";

function Transactions() {
  const { orderItems } = useStoreContext();
  const [selectedOrder, setSelectedOrder] = useState<ItemState | null>(null);
  const [selectedTxHash, setSelectedTxHash] = useState<`0x${string}` | null>(
    null,
  );
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [transactions, setTransactions] = useState<
    [OrderId, OrderState][] | []
  >([]);
  useEffect(() => {
    const carts = Array.from([...orderItems.entries()]);
    setTransactions(carts);
  }, [orderItems]);

  const handleTransactionsClick = (
    order: ItemState,
    hash: `0x${string}` | null,
  ) => {
    setSelectedOrder(order);
    hash && setSelectedTxHash(hash);
  };

  return (
    <main className="bg-gray-100 pt-under-nav">
      {selectedOrder && (
        <TransactionDetails
          opened={!!selectedOrder}
          order={selectedOrder}
          closeDetails={() => setSelectedOrder(null)}
          transactionHash={selectedTxHash || null}
        />
      )}
      <div className="m-4 mt-0">
        <h6 className="text-center p-5"> transactions</h6>
        <Search setSearchPhrase={setSearchPhrase} searchPhrase={searchPhrase} />
      </div>
      <section id="list" className="mt-6 min-h-[80vh]">
        <section>
          <h5 className="font-sans ml-4">Today</h5>
          <section className="mt-6 flex flex-col-reverse gap-2">
            {transactions?.length
              ? transactions.map((entry) => {
                  const cartId = entry[0];
                  const allItemsObj = entry[1];
                  const transactionHash = allItemsObj?.txHash || null;
                  if (!allItemsObj?.items) return null;
                  return (
                    <div key={cartId}>
                      <TransactionBlock
                        order={allItemsObj.items}
                        onClick={handleTransactionsClick}
                        orderStatus={allItemsObj.status || IStatus.Pending}
                        transactionHash={transactionHash}
                        searchPhrase={searchPhrase}
                      />
                    </div>
                  );
                })
              : null}
          </section>
        </section>
      </section>
    </main>
  );
}
export default withAuth(Transactions);
