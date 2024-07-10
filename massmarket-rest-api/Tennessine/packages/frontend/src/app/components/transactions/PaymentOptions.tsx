// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
import FullModal from "@/app/common/components/FullModal";
import Button from "@/app/common/components/Button";

const PaymentOptions = ({
  isOpen,
  onClose,
  checkout,
}: {
  isOpen: boolean;
  onClose: () => void;
  checkout: (ar: boolean) => void;
}) => {
  return (
    <FullModal isOpen={isOpen} header="Payment Options" onClose={onClose}>
      <main className="m-6 flex gap-4">
        <Button onClick={() => checkout(true)}>ERC20</Button>
        <Button onClick={() => checkout(false)}>ETH</Button>
      </main>
    </FullModal>
  );
};

export default PaymentOptions;
