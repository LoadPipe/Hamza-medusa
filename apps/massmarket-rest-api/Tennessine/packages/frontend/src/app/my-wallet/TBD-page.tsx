// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useMyContext } from "../../context/MyContext";
// import { formatEthAdd } from "../utils";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import { IStatus } from "@/types";
// import { useStoreContext } from "@/context/StoreContext";

// const MyWallet = () => {
//   const [walletBalance, setWalletBalance] = useState<string>("0");
//   const [walletAdd, setWalletAdd] = useState<string>("");
//   const { balance, walletAddress } = useMyContext();
//   const { db } = useStoreContext();
//   const router = useRouter();
//   const { setIsAuthenticated } = useAuth();

//   useEffect(() => {
//     if (walletAddress) {
//       setWalletAdd(walletAddress);
//     }
//     if (!balance) return;
//     // setWalletBalance(Number(balance) / 10 ** 18);
//     setWalletBalance(Number(balance).toFixed(2));
//   }, [walletAddress, balance]);

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(walletAdd);
//   };
//   const logout = () => {
//     db.clear();
//     setIsAuthenticated(IStatus.Pending);
//     localStorage.clear();
//     router.push("/");
//   };

//   return (
//     <main className="absolute bg-white left-0 right-0 bottom-0 top-0">
//       <div className="w-full border border-gray-200 p-4 text-base flex flex-col justify-between">
//         <div className="flex justify-between">
//           <div className="flex gap-1">
//             <Image
//               src="/assets/meta-mask.png"
//               width={24}
//               height={24}
//               alt="meta-mask"
//               unoptimized={true} // TODO: pre-scale images
//             />
//             <p data-testid="wallet-address" className="text-gray-800">
//               {formatEthAdd(walletAdd) || "N/A"}
//             </p>
//           </div>
//           <Link href="/products">
//             <Image
//               src="/assets/quit.svg"
//               width={24}
//               height={24}
//               alt="quit-icon"
//               className="h-6"
//               // onClick={close}
//             />
//           </Link>
//         </div>
//       </div>
//       <section className="text-center mt-8">
//         <p data-testid="balance" className="text-2xl">
//           {walletBalance} ETH
//         </p>
//         <p className="text-xm text-gray-700">wallet balance</p>
//       </section>
//       <section className="flex flex-col mt-6 gap-4 mx-4">
//         <button className="flex justify-center border-2 rounded border-gray-900 p-4">
//           <div className="flex gap-2" onClick={copyToClipboard}>
//             <Image
//               src="/assets/copy-icon.svg"
//               width={24}
//               height={24}
//               alt="eclipse-avatar"
//             />
//             <p>copy address</p>
//           </div>
//         </button>
//         <button
//           onClick={logout}
//           className="border-2 rounded p-4 border-gray-900"
//         >
//           logout
//         </button>
//       </section>
//     </main>
//   );
// };

// export default MyWallet;
