// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

import React from "react";
import { Providers } from "./providers";
import "./globals.css";
import Navigation from "./components/nav/Navigation";
export const metadata = {
  title: "wagmi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Mass Market @ ETHDubai</title>
      </head>
      <body className="min-h-screen">
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
