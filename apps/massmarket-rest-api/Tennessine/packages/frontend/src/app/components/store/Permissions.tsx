// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState } from "react";
import ModalHeader from "../../common/components/ModalHeader";
import Button from "../../common/components/Button";
import ContributorBlock from "./Contributor";
import HalfModal from "../../common/components/HalfModal";
import Contributor from "./Contributor";
import { useMyContext } from "@/context/MyContext";
import { formatPK } from "@/app/utils";

export type IContributor = {
  name: string;
  walletAddress: string;
};

const admins: IContributor[] = [
  { name: "Martin", walletAddress: "0x71C76...d8976F" },
  { name: "Mu", walletAddress: "0x71C76...d8976F" },
];

const clerks: IContributor[] = [
  { name: "Beatrice", walletAddress: "0x71C76...d8976F" },
  { name: "Henry", walletAddress: "0x71C76...d8976F" },
];

const Permissions = ({ close }: { close: () => void }) => {
  const { clientWallet } = useMyContext();
  const [showInviteLink, setShowInviteLink] = useState<boolean>(false);
  const [inviteLink, setInviteLink] = useState<`0x${string}` | null>(null);
  const [isHalfModalOpen, setIsHalfModalOpen] = useState(false);
  const { relayClient } = useMyContext();

  const openHalfModal = () => {
    setIsHalfModalOpen(true);
  };
  const closeHalfModal = () => {
    setIsHalfModalOpen(false);
  };

  //FIXME make this button pending for await
  const generateInvitationLink = async () => {
    if (clientWallet) {
      // @ts-expect-error TODO fix client api type spec
      const sk = await relayClient!.createInviteSecret(clientWallet);
      setInviteLink(sk);
    } else {
      console.warn("Must connect to wallet.");
    }
  };

  const copyToClipboard = () => {
    inviteLink &&
      navigator.clipboard.writeText(
        `${process.env.NODE_ENV === "development" ? "localhost:3000" : "mass.market"}?inviteSecret=${inviteLink}`,
      );
  };

  const renderList = (arr: IContributor[]) => {
    return arr.map((a: IContributor) => {
      return (
        <ContributorBlock
          contributor={a}
          key={a.name}
          openHalfModal={openHalfModal}
        />
      );
    });
  };

  const confirmModal = (
    <HalfModal isOpen={isHalfModalOpen} onClose={closeHalfModal}>
      <section className="text-center">
        <div>
          <h3>Remove Clerk</h3>
        </div>
        <p className="font-sans">
          Beatrice will lose all access to sell products.
        </p>
        <div className="mt-10">
          <Contributor
            contributor={{
              name: "Beatrice",
              walletAddress: "0x71C76...d8976F",
            }}
          />
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <Button color="bg-remove-button">Remove</Button>
          <button onClick={closeHalfModal}>Keep Clerk</button>
        </div>
      </section>
    </HalfModal>
  );
  return (
    <section className="pt-under-nav">
      {confirmModal}
      <ModalHeader headerText="Permissions" goBack={close} />
      <section className="m-4">
        <section id="add-contributors" className="border-b pb-10">
          <h5 className="font-sans">Add Contributors</h5>
          <p className="font-sans mt-4 text-gray-500">
            Generate an invite link to add people to your store and give them
            access to sell products.
          </p>
          <div className="mt-6">
            {showInviteLink && inviteLink ? (
              <div className="flex">
                <div className="border flex justify-center py-3 px-4 rounded-md w-full">
                  <p>{`mass.market/${formatPK(inviteLink)}`}</p>
                </div>
                <Button style={{ width: "10rem" }} onClick={copyToClipboard}>
                  Copy
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  generateInvitationLink();
                  setShowInviteLink(true);
                }}
              >
                Generate Invite Link
              </Button>
            )}
          </div>
        </section>
        <section id="contributors-list" className="mt-10">
          <h5 className="font-sans">Contributors</h5>
          <section>
            <div id="admins" className="mt-4">
              <p className="text-gray-500">Admins</p>
              <div>{renderList(admins)}</div>
            </div>
            <div id="clerks" className="mt-4">
              <p className="text-gray-500">Clerks</p>
              <div>{renderList(clerks)}</div>
            </div>
          </section>
        </section>
      </section>
    </section>
  );
};
export default Permissions;
