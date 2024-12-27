// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React from "react";
import Image from "next/image";
import { IRelay, RelayStatus } from "@/types";

const RelayBlock = ({ item, addable }: { item: IRelay; addable?: boolean }) => {
  const icon = addable ? "plus.svg" : "remove.svg";

  return (
    <div
      key={item.name}
      className="py-4 last:pb-0 border-b last:border-0 flex gap-4 items-center"
    >
      <div
        className={`w-3 h-3 p-1 rounded-full ${
          item.status == RelayStatus.Available ? "bg-green-700" : "bg-red-500"
        }`}
      ></div>
      <div id="relay-info">
        <p data-testid={"relay-name"} className="flex items-center">
          {item.name}
        </p>
        <p className="text-xs w-60">{item.location}</p>
      </div>
      <div className="ml-auto">
        <button>
          <Image
            src={`/assets/${icon}`}
            width={24}
            height={24}
            alt="remove-icon"
          />
        </button>
      </div>
    </div>
  );
};

export default RelayBlock;
