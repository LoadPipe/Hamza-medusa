"use client";
import React, { useState } from "react";
import Button from "@/app/common/components/Button";

const ShippingDetails = ({ checkout }: { checkout: () => void }) => {
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [number, setNumber] = useState("");
  console.log({ city, name, address, zip, country, number });
  return (
    <div className="mt-4 flex flex-col gap-4">
      <form
        className="flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <label htmlFor="price">Name</label>
        <input
          className="border-2 border-solid mt-1 p-3 rounded-2xl"
          id="name"
          name="name"
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="price">Address</label>
        <input
          className="border-2 border-solid mt-1 p-3 rounded-2xl"
          id="address"
          name="address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="flex gap-2">
          <div>
            <label htmlFor="price">City</label>
            <input
              className="border-2 border-solid mt-1 p-3 rounded-2xl	w-full"
              id="city"
              name="city"
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="price">Zip/Postal</label>
            <input
              className="border-2 border-solid mt-1 p-3 rounded-2xl	w-full"
              id="zip"
              name="zip"
              onChange={(e) => setZip(e.target.value)}
            />
          </div>
        </div>

        <label htmlFor="price">Country</label>
        <input
          className="border-2 border-solid mt-1 p-3 rounded-2xl"
          id="country"
          name="country"
          onChange={(e) => setCountry(e.target.value)}
        />
        <label htmlFor="price">Phone Number</label>
        <input
          className="border-2 border-solid mt-1 p-3 rounded-2xl"
          id="phone"
          name="phone"
          onChange={(e) => setNumber(e.target.value)}
        />
      </form>

      <Button onClick={checkout}>Checkout</Button>
    </div>
  );
};

export default ShippingDetails;
