// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

interface FullModalProps {
  isOpen: boolean;
  onClose?: () => void;
  header?: string;
  modalBgColor?: string;
  showAvatar?: boolean;
  children: ReactNode;
}

const FullModal: React.FC<FullModalProps> = ({
  isOpen,
  onClose,
  header,
  modalBgColor = "white",
  showAvatar = false,
  children,
}) => {
  if (!isOpen) {
    return null;
  }
  const hed = showAvatar ? (
    <div
      onClick={onClose}
      className="w-full border border-gray-200 p-4 text-base flex flex-col justify-between"
    >
      <div className="flex justify-between">
        <Image
          src="/assets/quit.svg"
          width={24}
          height={24}
          alt="quit-icon"
          className="h-6"
          onClick={close}
        />
        <Link href="/my-wallet">
          <Image
            src="/assets/example-avatar.svg"
            width={24}
            height={24}
            alt="eclipse-avatar"
          />
        </Link>
      </div>
    </div>
  ) : (
    <div onClick={onClose} id="container" className="flex relative m-4">
      <Image
        id="overlay"
        className="absolute margin-auto top-0 bottom-0 left-0 right-0"
        src="/assets/quit.svg"
        width={24}
        height={24}
        alt="arrow-icon"
      />
      <div className="flex justify-center w-full">
        <header className="ml-5">{header}</header>
      </div>
    </div>
  );
  return (
    <div
      id="full-modal"
      className="fixed inset-0 flex items-end justify-center z-40"
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
        role="presentation"
      ></div>
      <div
        className={`bg-${modalBgColor} rounded-lg w-full h-full min-w-md relative overflow-scroll`}
      >
        {onClose && hed}
        {children}
      </div>
    </div>
  );
};

export default FullModal;
