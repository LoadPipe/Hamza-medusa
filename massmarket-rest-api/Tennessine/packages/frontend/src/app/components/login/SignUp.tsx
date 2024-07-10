// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ConnectWallet from "./ConnectWallet";
import BigArrowRightButton from "../../common/components/BigArrowRightButton";
import { useAuth } from "@/context/AuthContext";
import { IStatus } from "@/types";
import SuccessFailModal from "@/app/components/login/SuccessFailModal";

const SignUp = ({ backToLanding }: { backToLanding: () => void }) => {
  const [openConnectModal, setOpenConnectModal] = useState(false);
  const { isAuthenticated } = useAuth();

  const [connectionStatus, setConnectionStatus] = useState<IStatus>(
    IStatus.Pending,
  );
  useEffect(() => {
    if (isAuthenticated === IStatus.Complete) {
      setConnectionStatus(IStatus.Complete);
    }
  }, [isAuthenticated]);

  if (connectionStatus == IStatus.Complete) {
    return <SuccessFailModal success={true} />;
  }

  if (openConnectModal) return <ConnectWallet close={backToLanding} />;
  return (
    <section className="bg-gray-100 h-screen absolute top-0	right-0	left-0">
      <div className="h-fit w-full p-4 text-base flex justify-between">
        <Image
          src="/assets/arrow-left.svg"
          width={24}
          height={24}
          alt="arrow-icon"
          className="h-6"
          onClick={backToLanding}
        />
      </div>
      <section className="mx-4 my-6">
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            setOpenConnectModal(true);
          }}
        >
          <label htmlFor="fname">What&apos;s your your Name?</label>
          <input
            className="border-2 border-solid mt-1 p-2"
            id="fname"
            name="fname"
            onChange={(e) => {
              e.preventDefault();
            }}
          />
        </form>
        <p className="font-sans text-sm text-gray-500 mt-2">
          This is the name you would like other people to use when referring to
          you.
        </p>
      </section>
      <div className="m-4 flex justify-end">
        <BigArrowRightButton
          onClick={() => {
            setOpenConnectModal(true);
          }}
        />
      </div>
    </section>
  );
};

export default SignUp;
