// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { SetStateAction, Dispatch } from "react";
import { createContext, useContext, useState } from "react";
import { ShopId } from "./types";

export type IMerchantContext = {
  storeIds: Map<ShopId, number> | null;
  setStoreIds: Dispatch<SetStateAction<Map<ShopId, number> | null>>;
};
export const MerchantContext = createContext<IMerchantContext>({
  storeIds: null,
  setStoreIds: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const MerchantProvider = (props: Props) => {
  const [storeIds, setStoreIds] = useState<Map<ShopId, number> | null>(null);

  return (
    <MerchantContext.Provider value={{ storeIds, setStoreIds }}>
      {props.children}
    </MerchantContext.Provider>
  );
};

export const useMerchantContext = () => useContext(MerchantContext);
