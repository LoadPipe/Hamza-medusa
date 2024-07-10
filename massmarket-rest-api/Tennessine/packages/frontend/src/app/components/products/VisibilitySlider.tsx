// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import { useStoreContext } from "@/context/StoreContext";
import { ItemId } from "@/types";
import React, { useEffect, useState } from "react";
import {
  selectedTagsAction,
  SELECT_TAG,
  DESELECT_TAG,
} from "@/reducers/tagReducers";
import { TagId, ITag } from "@/types";

const VisibilitySlider = ({
  selectedTagsDispatch,
  itemId,
  selectedTags,
}: {
  selectedTagsDispatch: (t: selectedTagsAction) => void;
  itemId: ItemId | null;
  selectedTags: Map<TagId, ITag>;
}) => {
  const { publishedTagId, allTags, addProductToTag, removeProductFromTag } =
    useStoreContext();
  const [selectedOption, setSelectedOption] = useState<number>(1);
  const [_selectedTags, setSelectedTags] = useState<Map<TagId, ITag>>(
    new Map(),
  );

  useEffect(() => {
    setSelectedTags(selectedTags);
  }, [selectedTags]);

  useEffect(() => {
    const isVisible =
      publishedTagId && _selectedTags
        ? _selectedTags.get(publishedTagId)?.id
        : false;
    isVisible ? setSelectedOption(1) : setSelectedOption(2);
  }, [allTags, publishedTagId, _selectedTags]);

  const handleVisibility = () => {
    if (publishedTagId) {
      selectedTagsDispatch({
        type: SELECT_TAG,
        payload: { selectedTag: { id: publishedTagId, text: "visibility" } },
      });
      setSelectedOption(1);
      if (itemId) {
        addProductToTag(publishedTagId, itemId);
      }
    }
  };

  const handleHideTag = () => {
    if (publishedTagId) {
      selectedTagsDispatch({
        type: DESELECT_TAG,
        payload: { selectedTag: { id: publishedTagId, text: "visibility" } },
      });
      setSelectedOption(2);
      //if updating product
      if (itemId) {
        removeProductFromTag(publishedTagId, itemId);
      }
    }
  };

  return (
    <section>
      <p className="mb-4">visibility</p>
      <div className="slider flex justify-between border rounded-lg bg-white text-center">
        <div
          className={`px-2 py-4 grow ${selectedOption === 1 ? "bg-gray-200" : ""}`}
        >
          <button onClick={handleVisibility}>Visible</button>
        </div>
        <div
          className={`px-2 py-4 grow ${selectedOption === 2 ? "bg-gray-200" : ""}`}
        >
          <button onClick={handleHideTag}>Hidden</button>
        </div>
        <div
          className={`px-2 py-4 grow ${selectedOption === 3 ? "bg-gray-200" : ""}`}
        >
          <button
            onClick={() => {
              console.log("feature not yet available. use vis/hidden options.");
            }}
          >
            Unavailable
          </button>
        </div>
      </div>
    </section>
  );
};

export default VisibilitySlider;
