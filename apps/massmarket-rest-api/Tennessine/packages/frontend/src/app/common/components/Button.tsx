// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

"use client";

import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    //fixme: make sure button ui is clicked, not just fire onclick fn
    return (
      <button
        className={`flex justify-center text-3xl text-white px-6 py-4 rounded-2xl ${
          props.color ? props.color : "bg-primary-button"
        } w-full disabled:bg-gray-200 disabled:text-gray-500`}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
export default Button;
