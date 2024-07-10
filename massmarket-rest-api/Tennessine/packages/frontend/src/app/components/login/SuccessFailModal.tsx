// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React from "react";
import Image from "next/image";
import Button from "@/app/common/components/Button";
import Link from "next/link";

function SuccessFailModal({
  success,
  tryAgain = () => {},
}: {
  success: boolean;
  tryAgain?: () => void;
}) {
  const authenticated = success;
  const hed = authenticated ? "Welcome to ETHDubai" : "Connection Declined";
  const sub = authenticated
    ? "You have successfully connected your wallet and now have access to the ETHDubai store."
    : "Sorry, access to the ETHDubai store is denied with your connected wallet.";
  const button = authenticated ? (
    <Link
      href="/products"
      className="flex justify-center text-white px-6 py-4 rounded-md bg-gradient-to-r from-button-gradient-start to-button-gradient-end"
    >
      View Store
    </Link>
  ) : (
    <Button onClick={tryAgain}>Try again</Button>
  );
  return (
    <section className="bg-white h-screen absolute top-0	right-0	left-0 flex flex-col">
      <div className="h-fit border-gray-200 p-4 text-base flex justify-end ">
        <Link href={"/products"}>
          <Image
            src="/assets/quit.svg"
            width={24}
            height={24}
            alt="quit-icon"
            className="h-6"
          />
        </Link>
      </div>
      <section className="mx-4 my-6 text-center">
        <div className="flex justify-center mt-40">
          <Image
            src="/assets/ethDubai.png"
            width={100}
            height={100}
            alt="ethDubai"
            unoptimized
          />
        </div>
        <h3 className="mt-8">{hed}</h3>
        <h5 className="font-sans pl-5 pr-5">{sub}</h5>
      </section>
      <div className="mt-auto p-5 mb-5">{button}</div>
    </section>
  );
}

export default SuccessFailModal;
