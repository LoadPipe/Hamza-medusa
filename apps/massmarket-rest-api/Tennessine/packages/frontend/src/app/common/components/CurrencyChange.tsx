// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React from "react";

const CurrencyChange = () => {
  return (
    <section>
      <p>Choose any ERC20 token to preview and pay.</p>
      <section className="bg-gray-300 ">
        <div className="mb-10">
          <p>choose chain</p>
          <div className="flex gap-2">
            <p className="bg-primary-gray w-fit px-2 py-1 rounded-lg">
              Ethereum
            </p>
            <p className="bg-primary-gray w-fit px-2 py-1 rounded-lg">
              Arbitrum
            </p>
            <p className="bg-primary-gray w-fit px-2 py-1 rounded-lg">Base</p>
          </div>
        </div>
        <div>
          <p>choose currency</p>
        </div>
        <div>
          <p>your tokens</p>
        </div>
      </section>
    </section>
  );
};

export default CurrencyChange;
