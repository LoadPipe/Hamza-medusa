// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useEffect } from "react";

import { useMyContext } from "@/context/MyContext";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { IStatus } from "../types";

function Homepage() {
  const { setInviteSecret } = useMyContext();
  const { isConnected } = useAuth();
  const searchParams = useSearchParams();
  const inviteSecret = searchParams!.get("inviteSecret") as `0x${string}`;
  const router = useRouter();

  useEffect(() => {
    if (isConnected === IStatus.Complete) {
      router.push("/products");
    }
  }, [isConnected]);

  if (inviteSecret) {
    setInviteSecret(inviteSecret);
  }

  return (
    <main className="min-h-screen overflow-hidden flex flex-col">
      <section className=" grow flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <h1 className="text-4xl">Mass Market</h1>
        </div>
      </section>
    </main>
  );
}

export default Homepage;
