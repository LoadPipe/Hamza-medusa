// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useEffect, useState } from "react";
import SignUp from "./components/login/SignUp";
import Button from "./common/components/Button";
import { Account } from "../wagmi/components/Account";
import { useMyContext } from "@/context/MyContext";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { IStatus } from "../types";
import ConnectWallet from "./components/login/ConnectWallet";

function Homepage() {
  const [openSignupModal, setOpenSignupModal] = useState<boolean>(false);
  const [openConnectModal, setOpenConnectModal] = useState<boolean>(false);

  const { setInviteSecret } = useMyContext();
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const inviteSecret = searchParams!.get("inviteSecret") as `0x${string}`;
  const router = useRouter();

  useEffect(() => {
    if (
      isAuthenticated === IStatus.Complete &&
      !openSignupModal &&
      !openConnectModal
    ) {
      router.push("/products");
    }
  }, [isAuthenticated]);

  if (inviteSecret) {
    setInviteSecret(inviteSecret);
  }

  const connectAction =
    isAuthenticated === IStatus.Complete
      ? () => router.push("/products")
      : inviteSecret
        ? () => setOpenSignupModal(true)
        : () => setOpenConnectModal(true);

  const welcomeCopy = inviteSecret
    ? "Register to become a clerk"
    : "Welcome back";

  if (openSignupModal) {
    return (
      <SignUp
        backToLanding={() => {
          setOpenSignupModal(false);
        }}
      />
    );
  } else if (openConnectModal) {
    return (
      <ConnectWallet
        close={() => {
          setOpenConnectModal(false);
        }}
      />
    );
  }

  return (
    <main className="min-h-screen overflow-hidden flex flex-col">
      <Account />

      <section className="bg-[url('/assets/Home-BG.png')] grow flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <h1 className="text-4xl">EthDubai</h1>
          <p className="text-gray-500">Powered by mass market</p>
        </div>
      </section>
      <section className="bg-gray-300 p-8 mt-auto">
        <p className="text-center font-sans mb-4 text-lg">{welcomeCopy}</p>
        <div>
          <Button
            onClick={connectAction}
            color={
              "bg-gradient-to-r from-button-gradient-start to-button-gradient-end"
            }
          >
            Connect Wallet
          </Button>
        </div>
      </section>
    </main>
  );
}

export default Homepage;
