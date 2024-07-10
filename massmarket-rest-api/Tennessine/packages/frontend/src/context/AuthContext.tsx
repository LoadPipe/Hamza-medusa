// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { SetStateAction, Dispatch } from "react";
import { createContext, useContext, useState } from "react";
import { IStatus } from "@/types";

export type IAuthContext = {
  isAuthenticated: IStatus;
  setIsAuthenticated: Dispatch<SetStateAction<IStatus>>;
};
export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: IStatus.Pending,
  setIsAuthenticated: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = (props: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState<IStatus>(
    IStatus.Pending,
  );
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
