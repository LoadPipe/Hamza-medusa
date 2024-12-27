// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React from "react";
import Image from "next/image";
import { ITag } from "@/types";

const Tag = ({
  tag,
  removeFn,
  onClick,
}: {
  onClick?: () => void;
  tag: ITag;
  removeFn?: () => Promise<void>;
}) => {
  const hex = tag.id.slice(-6).replace("0", "f");
  //FIXME: kind of a hacky way of removing items for now.
  if (tag.text === "visible" || tag.text === "remove") {
    return null;
  }
  return (
    <div
      id="tag"
      className={`w-fit flex text-sm rounded p-1`}
      style={{ backgroundColor: `#${hex}` }}
      onClick={onClick}
    >
      <Image src="/assets/2dots.svg" alt="2dots-icon" width={18} height={18} />
      <p className="mr-1">{tag.text}</p>
      {removeFn ? (
        <Image
          src="/assets/quit.svg"
          alt="2dots-icon"
          width={18}
          height={18}
          onClick={removeFn}
        />
      ) : null}
    </div>
  );
};

export default Tag;
