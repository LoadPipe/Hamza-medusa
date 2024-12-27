// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React from "react";
import ModalHeader from "../../common/components/ModalHeader";
import RelayBlock from "./RelayBlock";
import Image from "next/image";

import { IRelay } from "@/types";
import { useStoreContext } from "@/context/StoreContext";

const RelaysView = ({ close }: { close: () => void }) => {
  //fixme typescript error:
  const { relays } = useStoreContext();

  return (
    <main className="pt-under-nav">
      <ModalHeader headerText="Relays" goBack={close} />
      <section className="mx-4" id="provisioned">
        <div className="mb-4 flex flex-row gap-2">
          <h5 className="font-sans">Provisioned</h5>
          <Image
            src="/assets/information-icon.svg"
            width={18}
            height={18}
            alt="information-icon"
          />
        </div>
        <section data-testid="provisioned" className="border rounded px-4 pb-4">
          {relays.map((r: IRelay) => {
            return !r.provisioned ? <RelayBlock key={r.name} item={r} /> : null;
          })}
        </section>
        <section data-testid="available" className="mt-8">
          <h5 className="font-sans mb-4">Available</h5>
          <div className="border rounded px-4 pb-4">
            {relays.map((r: IRelay) => {
              return r.provisioned ? (
                <RelayBlock key={r.name} item={r} addable={true} />
              ) : null;
            })}
          </div>
        </section>
      </section>
    </main>
  );
};

export default RelaysView;
