// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import AvatarUpload from "@/app/common/components/AvatarUpload";
import { useMyContext } from "@/context/MyContext";
import { useAuth } from "@/context/AuthContext";
import * as abi from "@massmarket/contracts";
import { IStatus } from "@/types";
import { useRouter } from "next/navigation";
import SecondaryButton from "@/app/common/components/SecondaryButton";

const StoreCreation = () => {
  const {
    relayClient,
    publicClient,
    walletAddress,
    clientWallet,
    setKeyCardEnrolled,
  } = useMyContext();
  const router = useRouter();

  const [storeName, setStoreName] = useState<string>("");
  const [storeURL, setStoreURL] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [avatar, setAvatar] = useState<FormData | null>(null);
  const enrollKeycard = useRef(false);
  const { isAuthenticated } = useAuth();

  const handleStoreName = (e: ChangeEvent<HTMLInputElement>) => {
    setStoreName(e.target.value);
  };
  const handleStoreURL = (e: ChangeEvent<HTMLInputElement>) => {
    setStoreURL(e.target.value);
  };
  const handleDesription = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };
  const handleCurrency = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrency(e.target.value);
  };
  const createStore = () => {
    (async () => {
      if (relayClient && publicClient && clientWallet) {
        try {
          const storeId =
            localStorage.getItem("storeId") || process.env.NEXT_PUBLIC_STORE_ID;
          const hash = await relayClient.blockchain.createShop(clientWallet);
          const transaction =
            publicClient &&
            (await publicClient.waitForTransactionReceipt({
              hash,
            }));
          if (transaction.status == "success") {
            console.log("store created");
            const PERMRootHash = await publicClient.readContract({
              address: abi.addresses.ShopReg as `0x${string}`,
              abi: abi.ShopReg,
              functionName: "PERM_updateRootHash",
            });
            const _hasAccess = await publicClient.readContract({
              address: abi.addresses.ShopReg as `0x${string}`,
              abi: abi.ShopReg,
              functionName: "hasPermission",
              args: [storeId, walletAddress, PERMRootHash],
            });
            if (_hasAccess && clientWallet) {
              if (enrollKeycard.current) return;
              enrollKeycard.current = true;
              const res = await relayClient.enrollKeycard(clientWallet);
              if (res.ok) {
                const keyCardToEnroll = localStorage.getItem(
                  "keyCardToEnroll",
                ) as `0x${string}`;
                localStorage.setItem("keyCard", keyCardToEnroll);
                localStorage.removeItem("keyCardToEnroll");
                console.log(`keycard enrolled:${keyCardToEnroll}`);
                setKeyCardEnrolled(keyCardToEnroll);
              } else {
                console.error("failed to enroll keycard");
              }
            }
          }
        } catch (err) {
          console.log("error creating store", err);
        }
      }
    })();
  };

  useEffect(() => {
    if (relayClient && isAuthenticated === IStatus.Complete) {
      (async () => {
        const publishedTagId = new Uint8Array(32);
        crypto.getRandomValues(publishedTagId);
        await relayClient.shopManifest({
          name: storeName,
          description,
          profilePictureUrl: "https://http.cat/images/200.jpg",
          publishedTagId,
        });
        console.log("store manifested.");
        const newPubId = await relayClient.createTag({ name: "visible" });
        if (newPubId) {
          await relayClient!.updateShopManifest({ publishedTagId: newPubId });
        }
        const path = await relayClient!.uploadBlob(avatar as FormData);
        const metadata = {
          name: storeName,
          description: description,
          image: path.url,
        };
        const jsn = JSON.stringify(metadata);
        const blob = new Blob([jsn], { type: "application/json" });
        const file = new File([blob], "file.json");
        const formData = new FormData();
        formData.append("file", file);

        const { url } = await relayClient.uploadBlob(formData);
        if (clientWallet && url) {
          relayClient.blockchain.setShopMetadataURI(clientWallet, url);
        }

        router.push("/products");
      })();
    }
  }, [isAuthenticated, relayClient]);

  return (
    <main className="pt-under-nav h-screen p-4 mt-5">
      <div className="flex">
        <h2>Create new shop</h2>
        <div className="ml-auto">
          <SecondaryButton onClick={createStore}>
            <h6>save</h6>
          </SecondaryButton>
        </div>
      </div>
      <section className="mt-8 flex flex-col gap-4">
        <div className="flex gap-4">
          <div>
            <p>PFP</p>
            <AvatarUpload setImgBlob={setAvatar} />
          </div>
          <form
            className="flex flex-col grow"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="storeName">Store Name</label>
            <input
              className="border-2 border-solid mt-1 p-2 rounded-2xl"
              id="storeName"
              name="storeName"
              value={storeName}
              onChange={(e) => handleStoreName(e)}
              placeholder="Type a name"
            />
          </form>
        </div>

        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="fname">URL</label>
          <input
            className="border-2 border-solid mt-1 p-2 rounded-2xl"
            id="fname"
            name="fname"
            value={storeURL}
            onChange={(e) => handleStoreURL(e)}
          />
        </form>
        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="fname">Description</label>
          <input
            className="border-2 border-solid mt-1 p-2 rounded-2xl"
            id="fname"
            name="fname"
            value={description}
            onChange={(e) => handleDesription(e)}
            placeholder="Type a description"
          />
        </form>
        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="fname">Base Currency</label>
          <input
            className="border-2 border-solid mt-1 p-2 rounded-2xl"
            id="fname"
            name="fname"
            value={currency}
            onChange={(e) => handleCurrency(e)}
          />
        </form>
      </section>
    </main>
  );
};

export default StoreCreation;
