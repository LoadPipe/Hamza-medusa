// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState } from "react";
import Image from "next/image";
import StoreProfile from "../components/store/StoreProfile";
import Permissions from "../components/store/Permissions";
import RelaysView from "../components/store/RelaysView";
import withAuth from "../components/withAuth";

function Page() {
  const [openStoreProfile, setOpenStoreProfile] = useState<boolean>(false);
  const [openPermissions, setOpenPermissions] = useState<boolean>(false);
  const [openRelays, setOpenRelays] = useState<boolean>(false);

  if (openStoreProfile) {
    return <StoreProfile close={() => setOpenStoreProfile(false)} />;
  } else if (openPermissions) {
    return <Permissions close={() => setOpenPermissions(false)} />;
  } else if (openRelays) {
    return <RelaysView close={() => setOpenRelays(false)} />;
  }
  return (
    <main className="pt-under-nav">
      <section>
        <p className="text-center p-4">Store Settings</p>
      </section>
      <section className="m-4 flex flex-col gap-10">
        <section className="mt-4">
          <p className="font-sans">Your store</p>
          <div
            className="flex justify-between mt-4 border rounded p-4"
            onClick={() => setOpenStoreProfile(true)}
          >
            <div>
              <p>Store profile</p>
              <p className="text-xs text-gray-700 mt-1">
                Store name, store photo, and URL
              </p>
            </div>
            <Image
              src="/assets/forward-arrow.svg"
              width={24}
              height={24}
              alt="eclipse-avatar"
            />
          </div>
          <div
            className="flex justify-between border rounded p-4"
            onClick={() => setOpenPermissions(true)}
          >
            <div>
              <p>Permissions</p>
              <p className="text-xs text-gray-700 mt-1">5 contributors </p>
            </div>
            <Image
              src="/assets/forward-arrow.svg"
              width={24}
              height={24}
              alt="eclipse-avatar"
            />
          </div>
        </section>
        <section>
          <p className="font-sans">Relays</p>
          <div
            onClick={() => setOpenRelays(true)}
            className="flex justify-between mt-4 border rounded p-4"
          >
            <div>
              <p>Relays</p>
              <p className="text-xs text-gray-700 mt-1">3 connected</p>
            </div>
            <Image
              src="/assets/forward-arrow.svg"
              width={24}
              height={24}
              alt="eclipse-avatar"
            />
          </div>
        </section>
      </section>
    </main>
  );
}
export default withAuth(Page);
