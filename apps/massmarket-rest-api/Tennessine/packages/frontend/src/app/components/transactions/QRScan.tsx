// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import Image from "next/image";
import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { useStoreContext } from "@/context/StoreContext";
import { IStatus } from "@/types";

function QRScan({
  imgSrc,
  totalDollar,
  purchaseAddress,
  showModal,
  cryptoTotal,
  goBack,
}: {
  imgSrc: string | null;
  totalDollar: string;
  purchaseAddress: string;
  showModal: string | null;
  cryptoTotal: string;
  goBack: () => void;
}) {
  console.log("for testing send payment to:", imgSrc);
  const { orderId, orderItems, setOrderId } = useStoreContext();
  const [src, setQr] = useState<string | null>(null);
  const amount = (Number(cryptoTotal) / 10 ** 18).toFixed(2);
  //FIXME: render erc20
  // const erc20Amount = Number(cryptoTotal) / Math.pow(10, decimals);
  // const header = `${erc20Checkout ? erc20Amount : amount.toFixed(2)} ${symbol}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(purchaseAddress!);
  };

  useEffect(() => {
    imgSrc && QRCode.toDataURL(imgSrc).then(setQr);
  }, [imgSrc]);

  useEffect(() => {
    if (
      orderItems &&
      orderId &&
      orderItems.get(orderId)?.status === IStatus.Complete
    ) {
      setOrderId(null);
    }
  }, [orderItems]);

  return (
    <div
      id="QR-modal"
      className="text-center h-full flex items-center justify-center"
    >
      {showModal === "QR" ? (
        <div className="flex flex-col items-center gap-8">
          <button className="text-primary-gray" onClick={goBack}>
            go back
          </button>
          <div className="border-2 rounded-3xl p-2 shadow-xl">
            {src && <Image src={src} width={215} height={215} alt="QR-code" />}
          </div>
          <p className="text-primary-gray">scan to pay</p>
          <h2>{amount}</h2>
        </div>
      ) : (
        <div className="flex flex-col gap-5 text-primary-gray">
          <button onClick={goBack}>go back</button>
          <h2>
            Send <span className="text-black">{amount}</span>
          </h2>
          <p>{totalDollar}</p>
          <p>to this address:</p>
          <div className="flex text-center justify-center border-2 p-2 rounded-xl shadow-xl">
            <p>{purchaseAddress.slice(0, 20)}...</p>
            <button className="mr-4" onClick={copyToClipboard}>
              <Image
                src="/assets/copy-icon.svg"
                width={24}
                height={24}
                alt="copy-icon"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QRScan;
