// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Metadata } from "@/types";
import { ReadonlyURLSearchParams } from "next/navigation";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEthAdd(walletAdd: string) {
  return `${walletAdd.slice(0, 6)}...${walletAdd.slice(-4)}`;
}

export function formatPK(pk: `0x${string}`) {
  return `${pk.slice(0, 3)}...${pk.slice(-3)}`;
}

export const parseMetadata = (metadata: Uint8Array) => {
  const textDecoder = new TextDecoder();
  const result = textDecoder.decode(metadata);
  const _meta: Metadata = JSON.parse(result);
  return _meta;
};

export const decodeMetadata = (metadata: Uint8Array) => {
  const textDecoder = new TextDecoder();
  return textDecoder.decode(metadata);
};

export const createQueryString = (
  name: string,
  value: string,
  searchParams: ReadonlyURLSearchParams,
) => {
  const params = new URLSearchParams(searchParams);
  params.set(name, value);

  return params.toString();
};
