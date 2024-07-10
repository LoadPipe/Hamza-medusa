"use client";

import React from "react";
import Button from "@/app/common/components/Button";

const Main = () => {
  return (
    <main className="pt-under-nav h-screen p-5">
      <h1 className="mt-10">Long shop name</h1>
      <div className="flex text-xs gap-1">
        <Button>Go to Shop</Button>
        <Button disabled={true}>Add Product +</Button>
        <Button disabled={true}>Run Promo</Button>
      </div>
    </main>
  );
};

export default Main;
