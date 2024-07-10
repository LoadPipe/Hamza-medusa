// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";
import React, { Dispatch, SetStateAction, useRef, ChangeEvent } from "react";
import Image from "next/image";

const PhotoUpload = ({
  img,
  setImgSrc,
}: {
  img: string | null;
  setImgSrc: Dispatch<SetStateAction<string | null>>;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const buttonCopy = img ? "Change" : "Add";

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const fileInput = e.target;
      if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
          const img = e.target?.result;
          typeof img == "string" && setImgSrc(img);
        };

        reader.readAsDataURL(fileInput.files[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section>
      {!img ? (
        <div id="container" className="flex justify-center relative">
          <div id="background" className="flex">
            <span className="rounded-full inline-block stroke-gray-950 w-24 h-24 bg-gray-100"></span>
          </div>
          <div
            id="overlay"
            className="absolute margin-auto top-0 bottom-0 left-0 right-0 flex justify-center items-center"
          >
            <Image
              src="/assets/no-photo.svg"
              width={42}
              height={42}
              alt="no-photo"
            />
          </div>
        </div>
      ) : (
        <section className="flex flex-col justify-center items-center">
          <Image src={img} width={96} height={96} alt="eclipse-avatar" />
        </section>
      )}
      <div className="flex justify-center mt-6">
        <button
          onClick={triggerFileInput}
          className="flex items-center px-4 py-2 border-2 border-gray-700 rounded gap-1"
        >
          <Image
            src="/assets/camera-icon.svg"
            width={16}
            height={16}
            alt="eclipse-avatar"
          />
          <p className="text-xs">{buttonCopy}</p>
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

export default PhotoUpload;
