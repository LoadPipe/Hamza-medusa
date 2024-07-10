// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React from "react";
import { useAccount, useEnsName } from "wagmi";

export function Account() {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });

  return (
    <div>
      {ensName ?? address}
      {ensName ? ` (${address})` : null}
    </div>
  );
}
