// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import { ItemId } from "@/types";
import Link from "next/link";
import React from "react";
import { useSearchParams } from "next/navigation";
import { createQueryString } from "@/app/utils";
const SeeProductActions = ({
  isOpen,
  showConfirmModal,
  itemId,
}: {
  isOpen: boolean;
  showConfirmModal: () => void;
  itemId: ItemId;
}) => {
  const searchParams = useSearchParams();

  if (!isOpen) return null;
  return (
    <div className="bg-white flex flex-col justify-end	items-end  w-fit p-4 rounded-lg absolute right-0">
      <Link
        href={`/products/edit?${createQueryString("itemId", itemId, searchParams)}`}
      >
        edit
      </Link>
      <button onClick={showConfirmModal}>delete</button>
    </div>
  );
};

export default SeeProductActions;
