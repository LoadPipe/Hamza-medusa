"use client";
import ProgressBar from "@/app/components/checkout/ProgressBar";
import React, { useEffect, useState } from "react";
import { useStoreContext } from "@/context/StoreContext";
import NewCart from "@/app/cart/NewCart";
import ShippingDetails from "@/app/components/checkout/ShippingDetails";
import Image from "next/image";
import { IStatus } from "@/types";
import PaymentOptions from "@/app/components/checkout/PaymentOptions";

const CheckoutFlow = () => {
  const { commitOrder, finalizedOrders, orderItems, orderId, setOrderId } =
    useStoreContext();

  const [step, setStep] = useState(0);

  const [imgSrc, setSrc] = useState<null | string>(null);
  const [checkoutReqId, setCheckoutRequestId] = useState<`0x${string}` | null>(
    null,
  );
  const [showErrorMessage, setShowErrorMessage] = useState<null | string>(null);
  const [cryptoTotal, setCryptoTotal] = useState<string | null>(null);
  const [purchaseAdd, setPurchaseAdd] = useState<string | null>(null);
  const [totalDollar, setTotalDollar] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [number, setNumber] = useState("");

  useEffect(() => {
    if (
      orderItems &&
      orderId &&
      orderItems.get(orderId)?.status === IStatus.Complete
    ) {
      setOrderId(null);
      setStep(3);
    }
  }, [orderItems]);

  useEffect(() => {
    if (finalizedOrders.size && checkoutReqId) {
      const currentCart = finalizedOrders.get(checkoutReqId);
      if (!currentCart) return;
      const { totalInCrypto, purchaseAddress, total } = currentCart;
      setCryptoTotal(totalInCrypto);
      setPurchaseAdd(purchaseAddress);
      setTotalDollar(total);
      setSrc(`ethereum:${purchaseAddress}?value=${totalInCrypto}`);
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
      return (
        <ShippingDetails
          checkout={checkout}
          setCity={setCity}
          setName={setName}
          setAddress={setAddress}
          setZip={setZip}
          setCountry={setCountry}
          setNumber={setNumber}
        />
      );
    } else if (
      step === 2 &&
      imgSrc &&
      totalDollar &&
      purchaseAdd &&
      cryptoTotal
    ) {
      return (
        <PaymentOptions
          imgSrc={imgSrc}
          totalDollar={totalDollar}
          purchaseAddress={purchaseAdd}
          cryptoTotal={cryptoTotal}
          city={city}
          name={name}
          address={address}
          zip={zip}
          country={country}
          number={number}
        />
      );
    } else {
      return (
        <div className="text-center">
          <h2>Thank you</h2>
          <div className="flex-col items-center gap-2 flex">
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
      {/* <ModalHeader /> */}
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
