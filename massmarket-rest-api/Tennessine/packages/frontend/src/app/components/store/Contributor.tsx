// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React from "react";
import Image from "next/image";
import { IContributor } from "./Permissions";

const Contributor = ({
  contributor,
  openHalfModal,
}: {
  contributor: IContributor;
  openHalfModal?: () => void;
}) => {
  return (
    <div
      key={contributor.name}
      className="py-4 border-b only:border-0 flex gap-4"
    >
      <div id="container avatar" className="flex justify-center relative">
        <div id="background" className="flex">
          <span className="rounded-full inline-block stroke-gray-950 w-10 h-10 bg-gray-100"></span>
        </div>
        <div
          id="overlay"
          className="absolute margin-auto top-0 bottom-0 left-0 right-0 flex justify-center items-center text-gray-500"
        >
          {contributor.name[0] || "A"}
        </div>
      </div>
      <div id="contributor-info">
        <p className="flex items-center">{contributor.name}</p>
        <p className="text-xs text-gray-400">{contributor.walletAddress}</p>
      </div>
      <div className="ml-auto">
        <button onClick={openHalfModal}>
          <Image
            src="/assets/remove.svg"
            width={24}
            height={24}
            alt="remove-icon"
          />
        </button>
      </div>
    </div>
  );
};

export default Contributor;
