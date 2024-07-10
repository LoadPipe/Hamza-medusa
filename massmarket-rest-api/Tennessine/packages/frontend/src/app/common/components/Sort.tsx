// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React, { Dispatch, SetStateAction, useState, ChangeEvent } from "react";
import HalfModal from "./HalfModal";
import Button from "./Button";

import { SortOption } from "@/types";

const Sort = ({
  isOpen,
  close,
  setCheck,
  sortOption,
}: {
  isOpen: boolean;
  close: () => void;
  setCheck: Dispatch<SetStateAction<SortOption>>;
  sortOption: SortOption;
}) => {
  const [selected, setSelected] = useState(sortOption);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement;
    setSelected(value as SortOption);
  };

  const reset = () => {
    setSelected(SortOption.default);
    setCheck(SortOption.default);
    close();
  };

  const options = [
    "Price Low",
    "Price High",
    "Newest",
    "Default",
    "Available",
    "Hidden",
    "Unavailable",
  ];

  const renderOptions = () => {
    return options.map((o) => {
      if (o === SortOption.newest || o === SortOption.default) {
        return null;
      }
      return (
        <div key={o}>
          <input
            type="radio"
            id={o}
            value={o}
            checked={selected == o}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
          />
          <label className="ml-4">{o}</label>
        </div>
      );
    });
  };

  return (
    <section>
      <HalfModal isOpen={isOpen} onClose={close}>
        <header className="text-xl text-center mb-6">Sort By</header>
        <fieldset className="flex flex-col gap-4 py-4">
          {renderOptions()}
        </fieldset>
        <div className="mt-6">
          <Button
            color={
              "bg-gradient-to-r from-button-gradient-start to-button-gradient-end"
            }
            onClick={() => {
              setCheck(selected as SortOption);
              close();
            }}
          >
            Apply
          </Button>
          <button onClick={reset} className="w-full my-4">
            Reset
          </button>
        </div>
      </HalfModal>
    </section>
  );
};

export default Sort;
