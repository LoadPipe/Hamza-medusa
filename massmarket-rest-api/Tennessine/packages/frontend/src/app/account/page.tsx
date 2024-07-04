// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import EditName from "../components/account/EditName";
import AccountProfilePhoto from "../components/account/AccountProfilePhoto";
import { IRole, IStatus } from "@/types";
import { useMyContext } from "@/context/MyContext";
import { useAuth } from "@/context/AuthContext";
import { formatEthAdd } from "../utils";
import withAuth from "../components/withAuth";
import { useRouter } from "next/navigation";
import { useStoreContext } from "@/context/StoreContext";

const AccountSettings = () => {
  const { walletAddress, avatar, name } = useMyContext();
  const [openNameEdit, setOpenNameEdit] = useState<boolean>(false);
  const [openPhotoUpload, setOpenPhotoUpload] = useState<boolean>(false);
  const [profilePhoto, setProfilePhoto] = useState<string>(
    "/assets/example-avatar.svg",
  );
  const [firstName, setFirstName] = useState<string>("Martin");
  const [ethAdd, setEthAdd] = useState<string>("");
  const router = useRouter();
  const { setIsConnected } = useAuth();
  const { db } = useStoreContext();

  useEffect(() => {
    if (walletAddress) {
      setEthAdd(walletAddress);
    }
    if (avatar) {
      setProfilePhoto(avatar);
    }
    if (name) {
      setFirstName(name);
    }
  }, [walletAddress, avatar, name]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress!);
  };

  const logout = () => {
    db.clear();
    setIsConnected(IStatus.Pending);
    localStorage.clear();
    router.push("/");
  };

  if (openNameEdit) {
    return (
      <EditName
        closeEditName={() => setOpenNameEdit(false)}
        setFirstName={setFirstName}
        firstName={firstName}
      />
    );
  } else if (openPhotoUpload) {
    return (
      <AccountProfilePhoto
        setProfilePhoto={setProfilePhoto}
        closePhotoUpload={() => setOpenPhotoUpload(false)}
      />
    );
  }

  return (
    <main className="mx-4 pt-under-nav">
      <div className="flex justify-center my-5">
        <p>profile</p>
      </div>
      <section className="mb-24">
        <section>
          <p className="font-sans">General</p>
          <section className="border-b border-gray-200 py-6">
            <p className="text-xs text-gray-500">Name</p>
            <div
              className="flex justify-between mt-2"
              onClick={() => setOpenNameEdit(true)}
            >
              <p className="text-gray-700">{firstName}</p>
              <Image
                src="/assets/forward-arrow.svg"
                width={24}
                height={24}
                alt="forward-arrow"
              />
            </div>
          </section>
          <section className="border-b border-gray-200 py-6">
            <p className="text-xs text-gray-500">Profile Photo</p>
            <div
              className="flex justify-between mt-2"
              onClick={() => setOpenPhotoUpload(true)}
            >
              <Image
                src={profilePhoto}
                width={24}
                height={24}
                alt="profile-avatar"
              />
              <Image
                src="/assets/forward-arrow.svg"
                width={24}
                height={24}
                alt="forward-arrow"
              />
            </div>
          </section>
          <section className="border-b border-gray-200 py-6">
            <p className="text-xs text-gray-500">Role</p>
            <p className="text-gray-700 mt-2">{IRole.Admin}</p>
          </section>
        </section>
        <section className="py-12">
          <p className="font-sans">Wallet</p>
          <section className="border-b border-gray-200 py-6">
            <p className="text-xs">Eth Address</p>
            <div className="flex justify-between mt-2">
              <p className="text-gray-700">{formatEthAdd(ethAdd)}</p>
              <button onClick={copyToClipboard}>
                <Image
                  src="/assets/copy-icon.svg"
                  width={24}
                  height={24}
                  alt="copy-icon"
                />
              </button>
            </div>
          </section>
        </section>
        <section>
          <button onClick={logout}>Logout</button>
        </section>
      </section>
    </main>
  );
};

export default withAuth(AccountSettings);
