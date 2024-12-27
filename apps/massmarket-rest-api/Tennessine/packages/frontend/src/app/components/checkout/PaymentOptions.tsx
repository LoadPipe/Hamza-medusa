import React, { useState } from "react";
import SecondaryButton from "@/app/common/components/SecondaryButton";
import Chevron from "@/app/common/components/Chevron";
import Image from "next/image";
import FullModal from "@/app/common/components/FullModal";
import QRScan from "@/app/components/transactions/QRScan";
import WalletConnectQR from "../transactions/WalletConnectQR";

const PaymentOptions = ({
  imgSrc,
  totalDollar,
  purchaseAddress,
  cryptoTotal,
  name,
  address,
  city,
  zip,
  country,
  number,
}: {
  imgSrc: string;
  totalDollar: string;
  purchaseAddress: string;
  cryptoTotal: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  number: string;
}) => {
  const [showPaymentOptions, setShowPaymentOptions] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<"QR" | "Address" | null>(null);

  return (
    <div>
      <FullModal isOpen={Boolean(showModal)}>
        <QRScan
          imgSrc={imgSrc}
          totalDollar={totalDollar}
          purchaseAddress={purchaseAddress}
          cryptoTotal={cryptoTotal}
          showModal={showModal}
          goBack={() => setShowModal(null)}
        />
      </FullModal>

      <div className="text-primary-gray text-xs mt-8">
        <p className="text-center">Your order will be sent to:</p>
        <div className="ml-2 mt-4 flex gap-1 border-2 items-center border-gray-300 rounded-xl p-3">
          <div>
            <p>{name}</p>
            <p>{number}</p>
            <p>
              {address}, {city}, {country}, {zip}
            </p>
          </div>
          <div className="ml-auto">
            <SecondaryButton>EDIT</SecondaryButton>
          </div>
        </div>
      </div>
      <WalletConnectQR
        purchaseAddress={purchaseAddress}
        displayedTotal={cryptoTotal}
      />
      <div className="text-primary-gray mt-10 flex justify-center text-center">
        <p className="flex items-center">or</p>
        <button onClick={() => setShowPaymentOptions(!showPaymentOptions)}>
          <div className="ml-2 flex gap-1 border-2 border-gray-300 rounded-full px-3">
            find other ways to pay
            <Chevron hex="#777" open={showPaymentOptions} />
          </div>
        </button>
      </div>
      <div className={`${showPaymentOptions ? "flex gap-4 mt-8" : "hidden"}`}>
        <SecondaryButton onClick={() => setShowModal("QR")}>
          <div className="flex gap-2">
            <h6>Scan a QR code</h6>
            <Image
              src={"/assets/qr-code.svg"}
              width={15}
              height={15}
              alt="item-thumbnail"
              unoptimized={true}
            />
          </div>
        </SecondaryButton>
        <SecondaryButton onClick={() => setShowModal("Address")}>
          <div className="flex gap-2">
            <h6> Copy Address</h6>
            <Image
              src={"/assets/clipboard.svg"}
              width={15}
              height={15}
              alt="item-thumbnail"
              unoptimized={true}
            />
          </div>
        </SecondaryButton>
      </div>
    </div>
  );
};

export default PaymentOptions;
