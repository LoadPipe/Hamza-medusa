// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState } from "react";
import SuccessMessage from "../../common/components/SuccessMessage";
import ModalHeader from "../../common/components/ModalHeader";
import PhotoUpload from "../../common/components/PhotoUpload";
import Button from "../../common/components/Button";

const AccountProfilePhoto = ({
  closePhotoUpload,
  setProfilePhoto,
}: {
  closePhotoUpload: () => void;
  setProfilePhoto: (imgSrc: string) => void;
}) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [showSuccessMsg, setShowSuccessMsg] = useState<boolean>(false);

  const saveSelectedPhoto = () => {
    if (!imgSrc) {
      return;
    }
    setProfilePhoto(imgSrc!);
    setShowSuccessMsg(true);
  };

  const closeSuccessMessage = () => {
    setShowSuccessMsg(false);
  };

  return (
    <section className="pt-under-nav h-screen">
      {showSuccessMsg ? (
        <SuccessMessage show={!!showSuccessMsg} onClose={closeSuccessMessage} />
      ) : (
        <ModalHeader
          headerText="Edit Profile Photo"
          goBack={closePhotoUpload}
        />
      )}
      <section className="mx-4 h-5/6 flex flex-col">
        <section className="flex flex-col justify-center items-center mt-20">
          <PhotoUpload img={imgSrc} setImgSrc={setImgSrc} />
          <p className="text-sm text-center mt-4">
            Help your colleagues<br></br>recognize you
          </p>
        </section>
        <div className="mt-auto">
          <Button disabled={true} onClick={saveSelectedPhoto}>
            Change Profile Photo
          </Button>
        </div>
      </section>
    </section>
  );
};

export default AccountProfilePhoto;
