// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { IProduct, IRelay, RelayStatus } from "../types";
export const dummyProducts: IProduct[] = [
  {
    id: "0x1",
    metadata: {
      name: "Dubai Camel Sticker",
      image: "/assets/camel.png",
      description: "N/A",
    },
    price: "1.22",
    stockQty: 10,
  },
  {
    id: "0x2",
    metadata: {
      name: "Money Printer Sticker",
      image: "/assets/printer.png",
      description: "N/A",
    },
    price: "4.22",
    stockQty: 1,
  },
];

export const dummyRelays: IRelay[] = [
  {
    id: "0x3",
    name: "Pufferfish",
    location: "Unknown",
    status: RelayStatus.Available,
    provisioned: false,
  },
  {
    id: "0x1",
    name: "Weird Fishes",
    location: "Unknown",
    status: RelayStatus.Available,
    provisioned: false,
  },
  {
    id: "0x4",
    name: "CatFish",
    location: "San Francisco, California, United States",
    status: RelayStatus.Unavailable,
    provisioned: false,
  },
  {
    id: "0x8",
    name: "DogFish",
    location: "San Francisco, California, United States",
    status: RelayStatus.Available,
    provisioned: true,
  },
  {
    id: "0x9",
    name: "Betafish",
    location: "Unknown",
    status: RelayStatus.Available,
    provisioned: true,
  },
];
