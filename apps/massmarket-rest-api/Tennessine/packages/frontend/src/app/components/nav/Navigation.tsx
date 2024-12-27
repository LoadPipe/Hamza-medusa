// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useMyContext } from "@/context/MyContext";
import { useAuth } from "@/context/AuthContext";
import { IStatus } from "@/types";
import { useStoreContext } from "@/context/StoreContext";
import { useRouter, useSearchParams } from "next/navigation";
import FullModal from "@/app/common/components/FullModal";
import Link from "next/link";
import SecondaryButton from "@/app/common/components/SecondaryButton";
import { createQueryString } from "@/app/utils";

const _menuOptions = [
  {
    title: "Sales dashboard",
    img: "earnings.svg",
    href: "/merchant-dashboard",
  },
  { title: "Shop settings", img: "store-settings.svg", href: "/store" },
  { title: "My profile", img: "profile.svg", href: "/account" },
  { title: "New shop", img: "create-store.png", href: "/create-store" },
];

const Navigation = () => {
  const [menuOpened, setMenuOpened] = useState<boolean>(false);

  const { name } = useMyContext();
  const { setIsConnected, isMerchantView } = useAuth();
  const { db, storeData, invalidateOrder } = useStoreContext();
  const searchParams = useSearchParams();

  // const profilePhoto = avatar ? avatar : "example-avatar.svg";
  const router = useRouter();
  const logout = () => {
    db.clear();
    setIsConnected(IStatus.Pending);
    localStorage.clear();
    router.push("/");
  };

  const menuSwitch = () => {
    if (!isMerchantView) return;
    setMenuOpened(!menuOpened);
  };

  const renderItems = () => {
    return _menuOptions.map((opt, i) => {
      return (
        <section
          data-testid={`menu-button-${opt.title}`}
          key={i}
          onClick={() => setMenuOpened(false)}
        >
          <div className="flex">
            <Link href={opt.href} key={opt.title}>
              <h2>{opt.title}</h2>
            </Link>
          </div>
        </section>
      );
    });
  };

  return menuOpened ? (
    <FullModal isOpen={menuOpened}>
      <main>
        <div className="w-full border border-gray-200 p-4 text-base flex justify-between">
          <p>{name}</p>
          <div className="flex gap-4">
            <button onClick={menuSwitch}>
              <Image
                src={
                  storeData.profilePictureUrl
                    ? storeData.profilePictureUrl
                    : `/assets/MassLabsLogo.svg`
                }
                width={40}
                height={40}
                alt="profile-avatar"
                unoptimized={true}
              />
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-between mx-4 mt-4">
          <div className="mb-4">
            <h2>{storeData.name}</h2>
            <div className="flex text-xs gap-1">
              <SecondaryButton onClick={menuSwitch}>
                <Link className="flex items-center gap-1" href="/products">
                  Go to Shop
                  <Image
                    src="/assets/forward-button.svg"
                    width={12}
                    height={12}
                    alt="forward-icon"
                  />
                </Link>
              </SecondaryButton>
              <SecondaryButton onClick={menuSwitch}>
                <Link
                  href={`/products/edit?${createQueryString("itemId", "new", searchParams)}`}
                  onClick={menuSwitch}
                >
                  Add Product +
                </Link>
              </SecondaryButton>
              <SecondaryButton onClick={menuSwitch}>
                <div className="flex items-center gap-1">
                  Settings
                  <Image
                    src="/assets/settings.svg"
                    width={12}
                    height={12}
                    alt="settings-icon"
                  />
                </div>
              </SecondaryButton>
            </div>
          </div>
          <div>{renderItems()}</div>
          <div>
            <button onClick={() => invalidateOrder("new sale started")}>
              <h2>New Sale</h2>
            </button>
          </div>
          <div>
            <h2 onClick={logout}>Log out</h2>
          </div>
        </div>
      </main>
    </FullModal>
  ) : (
    <div className={`absolute left-0 top-0 right-0`}>
      <div className="w-full border border-gray-200 p-4 text-base flex justify-between">
        <div
          className="flex items-center text-primary-gray"
          onClick={menuSwitch}
        >
          <div className="flex gap-2">
            <Image
              src="/assets/back-button.svg"
              width={12}
              height={12}
              alt="hamburger-icon"
              className="h-6"
            />
            <p>back</p>
          </div>
          <p className="ml-5">{name}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={menuSwitch}>
            <Image
              src={
                storeData.profilePictureUrl
                  ? storeData.profilePictureUrl
                  : `/assets/MassLabsLogo.svg`
              }
              width={40}
              height={40}
              alt="profile-avatar"
              unoptimized={true}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
