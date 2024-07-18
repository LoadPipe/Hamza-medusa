// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

// components/withAuth.js
import React, { FunctionComponent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { IStatus } from "@/types";
interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default (WrappedComponent: FunctionComponent<PageProps>) => {
  return function WithAuth(props: PageProps) {
    const router = useRouter();
    const { isConnected } = useAuth();
    if (typeof window == "undefined") {
      console.warn("not a browser session");
      return;
    }
    if (isConnected === IStatus.Complete) {
      return <WrappedComponent {...props} />;
    } else {
      router.push("/");
    }
  };
};
