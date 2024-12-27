// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
}

const SecondaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    return (
      <button
        className={`flex justify-center items-center p-2 text-white rounded-lg ${
          props.color ? props.color : "bg-primary-gray"
        } w-full disabled:bg-gray-200 disabled:text-gray-500`}
        ref={ref}
        {...props}
      />
    );
  },
);
SecondaryButton.displayName = "Button";
export default SecondaryButton;
