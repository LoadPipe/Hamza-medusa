// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

export type ItemId = `0x${string}`;
export type TagId = `0x${string}`;
export type OrderId = `0x${string}`;

export type IProduct = {
  id: ItemId;
  price: string;
  metadata: Metadata;
  stockQty?: number;
  blob?: Blob | FormData | null;
  tagIds?: TagId[];
  saleQty?: number;
};
export type Metadata = {
  name: string;
  description: string;
  image: string;
};

export enum IStatus {
  Failed = "FAILED",
  Pending = "PENDING",
  Complete = "COMPLETE",
}

export enum RelayStatus {
  Available = "AVAILABLE",
  Unavailable = "UNAVAILABLE",
}

export type ITransaction = {
  id: number;
  status: IStatus;
  orders: IOrder[];
  createdAt?: Date;
  totalPrice: number;
  payment?: {
    id: number;
    paymentAddr: string;
  };
};

//transaction order
export type IOrder = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
};

export enum IRole {
  Owner = "OWNER",
  Admin = "ADMIN",
  Clerk = "CLERK",
}

export type IContributor = {
  id: number;
  role: IRole;
  name: string;
  keyCardId: string;
  thumbnail: string;
  walletAddress: string;
};

export type IRelay = {
  id: `0x${string}`;
  name: string;
  location: string;
  status: RelayStatus;
  provisioned: boolean;
};

export type ITag = {
  id: TagId;
  text: string;
  color?: string;
  visibleInSearchResults?: boolean;
};

export enum SortOption {
  priceLow = "Price Low",
  priceHigh = "Price High",
  newest = "Newest",
  default = "Default",
  available = "Available",
  hidden = "Hidden",
  unavailable = "Unavailable",
}

// export type Store = {
//   id: number;
//   name: string;
//   thumbnail: string;
//   products: IProduct[];
//   transactions: ITransaction[];
//   contributors: IContributor[];
//   authorizedKeyCards: number[];
//   relays: IRelay[];
//   tags: ITag[];
// };
