// SPDX-FileCopyrightText: 2024 Mass Labs
//
// SPDX-License-Identifier: GPL-3.0-or-later

// "use client";

// import React, { useState, useEffect, useRef } from "react";

// import Button from "../common/components/Button";
// import { useMyContext } from "@/context/MyContext";
// import { useAuth } from "@/context/AuthContext";
// import * as abi from "@massmarket/contracts";
// import { ManifestField } from "@massmarket/client";
// import { useStoreContext } from "@/context/StoreContext";
// import { IStatus } from "@/types";

// const CreateStore = () => {
//   const {
//     relayClient,
//     publicClient,
//     walletAddress,
//     clientWallet,
//     keyCardEnrolled,
//     setKeyCardEnrolled,
//   } = useMyContext();
//   const [storeCreated, setStoreCreated] = useState<string | null>(null);

//   const enrollKeycard = useRef(false);
//   const { isAuthenticated } = useAuth();
//   // const [keycardEnrolled, setKeycardEnrolled] = useState(false);
//   const [hasAccess, setAccess] = useState<boolean>(false);
//   const [storeId, setStoreId] = useState<`0x${string}` | null>(null);
//   const randomStoreIdHasBeenSet = useRef(false);
//   const defaultErc20Addr = process.env.NEXT_PUBLIC_DEFAULT_ERC20 ?? "";
//   const [newERC20, setNewERC20] = useState<string>(defaultErc20Addr);
//   const { setErc20Addr, setPublishedTagId, createTag } = useStoreContext();

//   useEffect(() => {
//     if (!randomStoreIdHasBeenSet.current && relayClient) {
//       randomStoreIdHasBeenSet.current = true;
//       const randomStoreId = relayClient.getRandomStoreId();
//       console.log(`enrolling storeID:${randomStoreId}`);
//       setStoreId(randomStoreId);
//     }
//   }, [relayClient]);

//   useEffect(() => {
//     if (relayClient && clientWallet) {
//       if (enrollKeycard.current) return;

//       relayClient.once("keycard enroll", async () => {
//         enrollKeycard.current = true;

//         const res = await relayClient.enrollKeycard(clientWallet);
//         if (res.ok) {
//           const keyCardToEnroll = localStorage.getItem(
//             "keyCardToEnroll",
//           ) as `0x${string}`;
//           localStorage.setItem("keyCard", keyCardToEnroll);
//           localStorage.removeItem("keyCardToEnroll");
//           console.log("keycard enrolled:", keyCardToEnroll);
//           setKeyCardEnrolled(keyCardToEnroll);
//         } else {
//           console.error("failed to enroll keycard");
//         }
//       });
//     }
//   }, [relayClient, clientWallet]);

//   useEffect(() => {
//     if (relayClient && isAuthenticated === IStatus.Complete) {
//       (async () => {
//         await relayClient.writeStoreManifest();
//         console.log("store manifested.");
//       })();
//     }
//   }, [isAuthenticated, relayClient]);

//   const copy = !relayClient
//     ? "Connect your wallet to create store."
//     : storeCreated
//       ? storeCreated
//       : "Ready to create store";

//   const createStore = () => {
//     (async () => {
//       if (relayClient && publicClient && storeId && clientWallet) {
//         try {
//           localStorage.setItem("storeId", storeId);
//           const hash = await relayClient.createStore(storeId, clientWallet);
//           console.log({ hash });
//           const transaction =
//             publicClient &&
//             (await publicClient.waitForTransactionReceipt({
//               hash,
//             }));
//           console.log({ transaction });
//           if (transaction.status == "success") {
//             setAccess(true);
//           }
//         } catch (err) {
//           setStoreCreated((err as Error).message);
//           console.log("error creating store", err);
//         }
//       }
//     })();
//   };

//   const writeManifest = () => {
//     relayClient!.writeStoreManifest().then((res) => {
//       console.log("store manifested", res);
//     });
//   };

//   useEffect(() => {
//     if (hasAccess && relayClient && publicClient) {
//       (async () => {
//         const PERMRootHash = await publicClient.readContract({
//           address: abi.addresses.StoreReg as `0x${string}`,
//           abi: abi.StoreReg,
//           functionName: "PERM_updateRootHash",
//         });
//         const _hasAccess = await publicClient.readContract({
//           address: abi.addresses.StoreReg as `0x${string}`,
//           abi: abi.StoreReg,
//           functionName: "hasPermission",
//           args: [storeId, walletAddress, PERMRootHash],
//         });
//         if (_hasAccess) {
//           relayClient.emit("keycard enroll");
//           setStoreCreated("Store has been created");
//         }
//       })();
//     }
//   }, [hasAccess, keyCardEnrolled]);

//   const addERC20 = async () => {
//     await relayClient!.updateManifest(
//       ManifestField.MANIFEST_FIELD_ADD_ERC20,
//       newERC20,
//     );
//     localStorage.setItem("erc20Addr", newERC20);
//     setErc20Addr(newERC20 as `0x${string}`);
//     console.log(`added new erc20: ${newERC20}`);
//   };
//   const renewPid = async () => {
//     const res = await createTag(":visible");
//     const publishedTagId = res.id;
//     if (publishedTagId) {
//       console.log(`updating store published tag id to: ${publishedTagId}`);
//       await relayClient!.updateManifest(
//         ManifestField.MANIFEST_FIELD_PUBLISHED_TAG,
//         publishedTagId,
//       );
//       setPublishedTagId(publishedTagId);
//       localStorage.setItem("publishedTagId", publishedTagId);
//     } else {
//       console.error("Error creating published tag id.");
//     }
//   };

//   return (
//     <main className="pt-under-nav bg-gray-100 h-screen">
//       <section className="m-4">
//         <p>{copy}</p>
//         <Button
//           onClick={createStore}
//           disabled={!relayClient || Boolean(storeCreated)}
//         >
//           Create Store
//         </Button>
//       </section>

//       <section className="m-4">
//         <h2 className="mt-6">
//           <strong>[Advanced]</strong> Use at your own peril💣
//         </h2>
//         <h3 className="mt-6">Write Manifest</h3>
//         <Button
//           onClick={writeManifest}
//           disabled={!relayClient || Boolean(storeCreated)}
//         >
//           Write Manifest
//         </Button>
//         <h3 className="mt-6">Reset Published Tag Id</h3>
//         <Button
//           onClick={renewPid}
//           disabled={!relayClient || Boolean(storeCreated)}
//         >
//           Reset ID
//         </Button>
//         <h3 className="mt-6">Add ERC20</h3>
//         <input
//           value={newERC20}
//           className="border-2 border-solid mt-1 p-3 rounded-lg"
//           id="erc20"
//           name="erc20"
//           onChange={(e) => setNewERC20(e.target.value)}
//         />
//         <Button
//           onClick={addERC20}
//           disabled={!relayClient || Boolean(storeCreated)}
//         >
//           Add ERC20
//         </Button>
//       </section>
//     </main>
//   );
// };

// export default CreateStore;
