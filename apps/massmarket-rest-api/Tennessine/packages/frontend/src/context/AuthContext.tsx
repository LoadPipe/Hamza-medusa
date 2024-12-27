// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { SetStateAction, Dispatch } from "react";
import { createContext, useContext, useState } from "react";
import { IStatus } from "@/types";

export type IAuthContext = {
  isConnected: IStatus;
  setIsConnected: Dispatch<SetStateAction<IStatus>>;
  hasUpdateRootHashPerm: boolean;
  setUpdateRootHashPerm: Dispatch<SetStateAction<boolean>>;
  isMerchantView: boolean;
  setIsMerchantView: Dispatch<SetStateAction<boolean>>;
};
export const AuthContext = createContext<IAuthContext>({
  isConnected: IStatus.Pending,
  setIsConnected: () => {},
  hasUpdateRootHashPerm: false,
  setUpdateRootHashPerm: () => {},
  isMerchantView: false,
  setIsMerchantView: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = (props: Props) => {
  const [isConnected, setIsConnected] = useState<IStatus>(IStatus.Pending);
  const [hasUpdateRootHashPerm, setUpdateRootHashPerm] =
    useState<boolean>(false);
  const [isMerchantView, setIsMerchantView] = useState<boolean>(false);
  return (
    <AuthContext.Provider
      value={{
        isConnected,
        setIsConnected,
        hasUpdateRootHashPerm,
        setUpdateRootHashPerm,
        isMerchantView,
        setIsMerchantView,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
