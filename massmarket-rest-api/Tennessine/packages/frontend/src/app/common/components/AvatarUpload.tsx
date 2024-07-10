// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, {
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  ChangeEvent,
} from "react";
import Image from "next/image";

const AvatarUpload = ({
  setImgBlob,
}: {
  setImgBlob: Dispatch<SetStateAction<FormData | null>>;
}) => {
  const [localImg, setLocalImg] = useState<null | string>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      e.preventDefault();
      const fileInput = e.target;
      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        const blob = new FormData();
        blob.append("file", fileInput.files[0]);
        reader.onload = function (e) {
          const img = e.target?.result;
          blob && setImgBlob(blob);
          typeof img == "string" && setLocalImg(img);
        };

        reader.readAsDataURL(fileInput.files[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section>
      <div className="flex justify-center">
        <button onClick={triggerFileInput}>
          <Image
            src={localImg ? localImg : "/assets/upload-button.svg"}
            width={52}
            height={52}
            alt="upload"
          />
        </button>
        <div className="hidden">
          <input
            type="file"
            ref={fileInputRef}
            className="file-input"
            accept="image/*"
            onChange={handleUpload}
          />
        </div>
      </div>
    </section>
  );
};

export default AvatarUpload;
