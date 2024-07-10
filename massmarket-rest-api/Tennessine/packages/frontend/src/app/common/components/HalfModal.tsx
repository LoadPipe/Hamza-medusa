// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React, { ReactNode } from "react";

interface HalfModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const HalfModal: React.FC<HalfModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }
  return (
    <div
      id="half-modal"
      className="fixed inset-0 flex items-end justify-center z-40"
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
        role="presentation"
      ></div>
      <div className="bg-white p-6 rounded-3xl w-full min-w-full relative">
        <div>{children}</div>
      </div>
    </div>
  );
};

export default HalfModal;
