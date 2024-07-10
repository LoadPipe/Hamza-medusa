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
  { title: "Sales dashboard", img: "earnings.svg", href: "/earnings" },
  { title: "Shop settings", img: "store-settings.svg", href: "/store" },
  { title: "My profile", img: "profile.svg", href: "/account" },
  { title: "New shop", img: "create-store.png", href: "/create-store" },
];

const Navigation = () => {
  const [menuOpened, setMenuOpened] = useState<boolean>(false);

  const { name } = useMyContext();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const { db, storeData } = useStoreContext();
  const searchParams = useSearchParams();

  // const profilePhoto = avatar ? avatar : "example-avatar.svg";
  const router = useRouter();
  const logout = () => {
    db.clear();
    setIsAuthenticated(IStatus.Pending);
    localStorage.clear();
    router.push("/");
  };

  // const profilePhoto = avatar ? avatar : "example-avatar.svg";
  // const activeCartItems = orderId && orderItems.get(orderId)?.items;
  // const arr = activeCartItems ? Object.values(activeCartItems) : [];
  // let len = 0;
  // for (const val of arr) {
  //   len += val;
  // }
  const loggedIn = isAuthenticated === IStatus.Complete;
  const menuSwitch = () => {
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
          <p>{name || "antimofm.eth"}</p>
          <div className="flex gap-4">
            <button onClick={menuSwitch}>
              <Image
                src={`/assets/MassLabsLogo.svg`}
                width={24}
                height={24}
                alt="profile-avatar"
              />
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-between mx-4 mt-4">
          <div className="mb-4">
            <h2>{storeData.name}</h2>
            <div className="flex text-xs gap-1">
              <SecondaryButton>
                <div className="flex items-center gap-1">
                  Go to Shop
                  <Image
                    src="/assets/forward-button.svg"
                    width={12}
                    height={12}
                    alt="forward-icon"
                  />
                </div>
              </SecondaryButton>
              <SecondaryButton>
                <Link
                  href={`/products/edit?${createQueryString("itemId", "new", searchParams)}`}
                  onClick={menuSwitch}
                >
                  Add Product +
                </Link>
              </SecondaryButton>
              <SecondaryButton>
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
            <h2 onClick={logout}>Log out</h2>
          </div>

          {/* <div className="absolute bottom-0 left-0 right-0 mb-20 mx-5">
          <button
            type="button"
            className="flex justify-center bg-gradient-to-r from-button-gradient-start to-button-gradient-end w-full text-white px-4 py-4 rounded-md"
            onClick={() => {
              invalidateOrder("New sale started.");
              router.push("/products");
              onClose();
            }}
          >
            New Sale
          </button>
        </div> */}
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
          {loggedIn ? (
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
          ) : null}
          <p className="ml-5">{name || "antimofm.eth"}</p>
        </div>
        {loggedIn ? (
          <div className="flex gap-4">
            <button onClick={menuSwitch}>
              <Image
                src={`/assets/MassLabsLogo.svg`}
                width={24}
                height={24}
                alt="profile-avatar"
              />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Navigation;
