// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState, useEffect } from "react";
import ModalHeader from "../../common/components/ModalHeader";
import PhotoUpload from "../../common/components/PhotoUpload";
import Button from "../../common/components/Button";

const StoreProfile = ({ close }: { close: () => void }) => {
  const [storeName, setStoreName] = useState<string>("ethDubai");
  const [storeURL, setStoreURL] = useState<string>("ethdubai.mass.market");
  const [avatar, setAvatar] = useState<string | null>(null);

  //FIXME: once we set up ts client for saving store name and url.
  useEffect(() => {
    setStoreName("ethDubai");
    setStoreURL("ethdubai.mass.market");
  }, []);

  return (
    <section className="pt-under-nav h-screen">
      <ModalHeader headerText="Store Profile" goBack={close} />
      <section className="flex flex-col h-5/6">
        <PhotoUpload img={avatar} setImgSrc={setAvatar} />
        <div className="m-4">
          <p className="font-sans">General</p>
          <section className="text-sm flex flex-col gap-4">
            <div>
              {/* FIXME: make this text area into reusuable components */}
              <section className="mt-4">
                <form
                  className="flex flex-col"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="fname">Store Name</label>
                  <input
                    //   placeholder={firstName}
                    className="border-2 border-solid mt-1 p-2 rounded"
                    id="fname"
                    name="fname"
                    value={storeName}
                  />
                </form>
              </section>
              {/* <p>Store Name</p> */}
            </div>
            <div>
              <section>
                <form
                  className="flex flex-col"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <label htmlFor="fname">Store URL</label>
                  <input
                    className="border-2 border-solid mt-1 p-2 rounded"
                    id="fname"
                    name="fname"
                    value={storeURL}
                  />
                </form>
              </section>
            </div>
          </section>
        </div>
        <div className="mt-auto mx-4">
          <Button disabled={true} onClick={() => null}>
            Update
          </Button>
        </div>
      </section>
    </section>
  );
};

export default StoreProfile;
