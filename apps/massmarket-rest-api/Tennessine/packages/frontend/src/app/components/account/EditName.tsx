// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { useState } from "react";
import SuccessMessage from "../../common/components/SuccessMessage";
import ModalHeader from "../../common/components/ModalHeader";
import Button from "../../common/components/Button";

const EditName = ({
  closeEditName,
  setFirstName,
  firstName,
}: {
  closeEditName: () => void;
  setFirstName: (n: string) => void;
  firstName: string;
}) => {
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [showSuccessMsg, setShowSuccessMsg] = useState<boolean>(false);

  const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
    const input = e.target as HTMLInputElement;
    if (!input) return;
    const name: string = input.value;
    setFirstName(name);
    if (name !== firstName) {
      setDisabled(false);
    }
  };
  const saveName = () => {
    //call to db here.
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
        <ModalHeader goBack={closeEditName} headerText="Edit Name" />
      )}
      <section className="flex flex-col justify-between h-5/6 mx-4">
        <section className="mt-10">
          <form
            onChange={(e) => handleChange(e)}
            className="flex flex-col"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="fname">Name</label>
            <input
              placeholder={firstName}
              className="border-2 border-solid mt-1 p-2"
              id="fname"
              name="fname"
            />
          </form>
          <p className="font-sans text-sm text-gray-500 mt-2">
            This is the name you would like other people to use when referring
            to you.
          </p>
        </section>
        <div className="mt-auto">
          <Button disabled={disabled} onClick={saveName}>
            Update Name
          </Button>
          {/* <button className="flex justify-center bg-green-600 w-full text-white px-4 py-4 rounded-md">
                <Image
                  src="/assets/checkmark.svg"
                  alt="checkmark-icon"
                  width={24}
                  height={24}
                />
              </button> */}
        </div>
      </section>
    </section>
  );
};

export default EditName;
