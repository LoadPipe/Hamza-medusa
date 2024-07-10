"use client";
import ProgressBar from "@/app/components/checkout/ProgressBar";
import React, { useEffect, useState } from "react";
import { useStoreContext } from "@/context/StoreContext";
import NewCart from "@/app/cart/NewCart";
// import CurrencyChange from "@/app/common/components/CurrencyChange";
// import CurrencyButton from "@/app/common/components/CurrencyButton";
import ShippingDetails from "@/app/components/checkout/ShippingDetails";
import Image from "next/image";

import PaymentOptions from "@/app/components/checkout/PaymentOptions";
import ModalHeader from "@/app/common/components/ModalHeader";

const CheckoutFlow = () => {
  const { commitOrder, finalizedOrders } = useStoreContext();

  const [step, setStep] = useState(0);

  const [imgSrc, setSrc] = useState<null | string>(null);
  const [checkoutReqId, setCheckoutRequestId] = useState<`0x${string}` | null>(
    null,
  );
  const [showErrorMessage, setShowErrorMessage] = useState<null | string>(null);
  const [erc20Checkout, setErc20Checkout] = useState<boolean>(false);
  const [cryptoTotal, setCryptoTotal] = useState<string | null>(null);
  const [purchaseAdd, setPurchaseAdd] = useState<string | null>(null);
  const [totalDollar, setTotalDollar] = useState<string | null>(null);
  // const [showCurrencyOptions, setShowCurrencyOptions] =
  //   useState<boolean>(false);

  useEffect((): void => {
    if (finalizedOrders && checkoutReqId) {
      const currentCart = finalizedOrders.get(checkoutReqId);
      if (!currentCart) return;
      const { totalInCrypto, erc20Addr, purchaseAddress, total } = currentCart;
      setCryptoTotal(totalInCrypto);
      //FIXME
      setErc20Checkout(false);
      setPurchaseAdd(purchaseAddress);
      setTotalDollar(total);
      if (erc20Checkout) {
        setSrc(
          `ethereum:${erc20Addr}/transfer?address=${purchaseAddress}&uint256=${totalInCrypto}`,
        );
      } else {
        setSrc(`ethereum:${purchaseAddress}?value=${totalInCrypto}`);
      }
      setStep(2);
    }
  }, [finalizedOrders, checkoutReqId]);

  const checkout = async () => {
    const isERC20Checkout = false;
    const res = await commitOrder(isERC20Checkout);
    if (res.error) {
      console.log("there was an error");
      setShowErrorMessage(res.error);
    } else if (res.orderFinalizedId) {
      setCheckoutRequestId(res.orderFinalizedId);
    }
  };

  const renderContent = () => {
    if (step === 0) {
      return <NewCart next={() => setStep(1)} />;
    } else if (step === 1) {
      return <ShippingDetails checkout={checkout} />;
    } else if (
      step === 2 &&
      imgSrc &&
      totalDollar &&
      purchaseAdd &&
      cryptoTotal
    ) {
      return (
        <PaymentOptions
          next={() => {
            setStep(3);
          }}
          imgSrc={imgSrc}
          totalDollar={totalDollar}
          purchaseAddress={purchaseAdd}
          cryptoTotal={cryptoTotal}
        />
      );
    } else {
      return (
        <div className="text-center">
          <h2>Thank you</h2>
          <div className="flex-col items-center gap-2">
            <p>Tx hash:</p>
            <div className="bg-white w-fit p-2 border-2 rounded-xl shadow-lg flex gap-2">
              <p>0xb5c8 ... 9838</p>
              <Image
                src={"/assets/copy-icon.svg"}
                width={15}
                height={15}
                alt="item-thumbnail"
                unoptimized={true}
              />
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <main className="pt-under-nav h-screen bg-gray-100 ">
      {/* FIXME: need banner design for errors */}
      {showErrorMessage && showErrorMessage}
      <ModalHeader />
      {/* <CurrencyButton
        toggle={() => setShowCurrencyOptions(!showCurrencyOptions)}
      /> */}
      <div className="px-5">
        <div>
          <ProgressBar
            allSteps={["Review Cart", "Shipping Details", "Payment", "Success"]}
            currentStep={step}
          />
          {renderContent()}
        </div>
      </div>
    </main>
  );
};

export default CheckoutFlow;
