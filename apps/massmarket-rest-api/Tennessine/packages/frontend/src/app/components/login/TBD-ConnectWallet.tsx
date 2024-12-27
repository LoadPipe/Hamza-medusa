// // SPDX-FileCopyrightText: 2024 Mass Labs
// //
// // SPDX-License-Identifier: GPL-3.0-or-later

// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import { Connector, useConnect, useWalletClient } from "wagmi";
// import { useMyContext } from "@/context/MyContext";

// import * as abi from "@massmarket/contracts";

// import { useAuth } from "@/context/AuthContext";
// import SuccessFailModal from "./SuccessFailModal";
// import { IStatus } from "@/types";

// const ConnectWallet = ({ close }: { close: () => void }) => {
//   const { connectors, connect } = useConnect();
//   const { publicClient, clientWallet, shopId } = useMyContext();
//   const [pending, setPending] = useState<boolean>(false);
//   const [hasAccess, setAccess] = useState<boolean>(false);
//   const {
//     walletAddress,
//     inviteSecret,
//     relayClient,
//     setWallet,
//     setKeyCardEnrolled,
//   } = useMyContext();
//   const { isConnected, setIsConnected } = useAuth();
//   const enrollKeycard = useRef(false);
//   const redeemSecret = useRef(false);
//   const { data: _wallet, status: walletStatus } = useWalletClient();
//   const [connectionStatus, setConnectionStatus] = useState<IStatus>(
//     IStatus.Pending,
//   );
//   if (typeof window == "undefined") {
//     console.warn("not a browser session");
//     return;
//   }
//   const keyCardToEnroll = localStorage.getItem(
//     "keyCardToEnroll",
//   ) as `0x${string}`;

//   const tryAgain = () => {
//     setConnectionStatus(IStatus.Pending);
//   };

//   useEffect(() => {
//     if (walletStatus !== "success") return;
//     _wallet && setWallet(_wallet);
//   }, [walletStatus]);

//   useEffect(() => {
//     if (relayClient) {
//       if (enrollKeycard.current) return;
//       if (keyCardToEnroll && clientWallet) {
//         enrollKeycard.current = true;
//         relayClient.once("keycard enroll", async () => {
//           const res = await relayClient.enrollKeycard(
//             clientWallet,
//             false,
//             shopId,
//           );
//           if (res.ok) {
//             setKeyCardEnrolled(true);
//             keyCardToEnroll && localStorage.setItem("keyCard", keyCardToEnroll);
//             setIsConnected(IStatus.Complete);
//             setConnectionStatus(IStatus.Complete);
//           } else {
//             enrollKeycard.current = false;
//             setConnectionStatus(IStatus.Failed);
//             setIsConnected(IStatus.Failed);
//             localStorage.removeItem("keyCard");
//           }
//           localStorage.removeItem("keyCardToEnroll");
//         });
//       }
//     }
//   }, [relayClient, clientWallet]);

//   const newClerk = inviteSecret?.length && walletAddress;
//   const returningClerk = walletAddress && !inviteSecret?.length;

//   useEffect(() => {
//     if (
//       newClerk &&
//       !pending &&
//       publicClient &&
//       relayClient &&
//       !redeemSecret.current &&
//       clientWallet
//     ) {
//       redeemSecret.current = true;
//       (async () => {
//         setPending(true);

//         // @ts-expect-error TODO fix client api type spec
//         const hash = await relayClient.redeemInviteSecret(
//           inviteSecret,
//           clientWallet,
//         );
//         const transaction = await publicClient.waitForTransactionReceipt({
//           hash,
//         });
//         if (transaction.status == "success") {
//           const PERMRootHash = await publicClient.readContract({
//             address: abi.addresses.ShopReg as `0x${string}`,
//             abi: abi.ShopReg,
//             functionName: "PERM_updateRootHash",
//           });
//           const hasAccess = await publicClient.readContract({
//             address: abi.addresses.ShopReg as `0x${string}`,
//             abi: abi.ShopReg,
//             functionName: "hasPermission",
//             args: [shopId, walletAddress, PERMRootHash],
//           });
//           console.log({ hasAccess });
//           setAccess(true);
//         }
//       })();
//     }
//   }, [relayClient]);

//   useEffect(() => {
//     if (
//       (returningClerk || (newClerk && hasAccess)) &&
//       relayClient &&
//       isConnected === IStatus.Pending
//     ) {
//       (async () => {
//         keyCardToEnroll && relayClient.emit("keycard enroll");
//       })();
//     }
//   }, [hasAccess, relayClient, clientWallet]);

//   const displayConnectors = () => {
//     return connectors.map((connector: Connector) => (
//       <button
//         key={connector.uid}
//         onClick={() => connect({ connector })}
//         className="p-4 bg-white my-4 border rounded w-full"
//       >
//         {connector.name}
//       </button>
//     ));
//   };

//   if (connectionStatus !== IStatus.Pending) {
//     const status = connectionStatus === IStatus.Complete ? true : false;
//     return <SuccessFailModal success={status} tryAgain={tryAgain} />;
//   }

//   return (
//     <section className="bg-gray-100 h-screen absolute top-0	right-0	left-0">
//       <div className="h-fit w-full border border-gray-200 p-4 text-base flex justify-between">
//         <div className="flex">
//           <p className="ml-2">Connect Wallet</p>
//         </div>
//         <Image
//           src="/assets/quit.svg"
//           width={24}
//           height={24}
//           alt="quit-icon"
//           className="h-6"
//           onClick={close}
//         />
//       </div>
//       <section className="mx-4 my-6">
//         <p className="font-sans">Connect your wallet</p>
//         <div>{displayConnectors()}</div>
//       </section>
//     </section>
//   );
// };

// export default ConnectWallet;
