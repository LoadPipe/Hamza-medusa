// // SPDX-FileCopyrightText: 2024 Mass Labs
// //
// // SPDX-License-Identifier: GPL-3.0-or-later

// "use client";
// import React, { useState, useEffect } from "react";
// import FullModal from "@/app/common/components/FullModal";
// import Image from "next/image";
// import QRScan from "@/app/components/transactions/QRScan";
// import { IStatus } from "@/types";
// import { useStoreContext } from "@/context/StoreContext";
// import { useMyContext } from "@/context/MyContext";
// // import WalletConnectQR from "@/app/components/transactions/WalletConnectQR";

// const TransactionStatus = ({
//   onClose,
//   isOpen,
//   imgSrc,
//   displayedTotal,
//   erc20Checkout,
//   purchaseAddress,
//   totalDollar,
// }: {
//   onClose: () => void;
//   isOpen: boolean;
//   imgSrc: string | null;
//   displayedTotal: string;
//   erc20Checkout: boolean;
//   purchaseAddress: string;
//   totalDollar: string;
// }) => {
//   const { invalidateOrder, erc20Addr } = useStoreContext();
//   const [showStatusScreen, setStatusScreen] = useState<boolean>(false);
//   const [status, setStatus] = useState<IStatus>(IStatus.Complete);
//   const [symbol, setSymbol] = useState("ETH");
//   const [decimals, setDecimals] = useState<number>(0);
//   const { getTokenInformation } = useMyContext();

//   useEffect(() => {
//     (async () => {
//       if (erc20Addr && erc20Checkout) {
//         const info = await getTokenInformation(erc20Addr);
//         console.log("ERC20 Token information:", info);
//         const { symbol, decimals } = info;
//         symbol && setSymbol(symbol);
//         setDecimals(decimals);
//       }
//     })();
//   }, [erc20Checkout]);

//   const handleCloseQRScan = () => {
//     // if exited without payment,
//     // clear cart and show failed status since cart has already been finalized,
//     // but not paid.
//     setStatus(IStatus.Failed);
//     setStatusScreen(true);
//     invalidateOrder("Exited committed cart without payment");
//   };

//   if (!imgSrc) {
//     //loading screen
//     return (
//       <FullModal isOpen={isOpen}>
//         <main>
//           <section className="flex justify-center mt-40">
//             <div className="flex gap-2">
//               <Image
//                 src="/assets/Ellipse.svg"
//                 width={16}
//                 height={16}
//                 alt="eclipse-avatar"
//               />
//               <Image
//                 src="/assets/Polygon.svg"
//                 width={21}
//                 height={21}
//                 alt="eclipse-avatar"
//                 unoptimized={true}
//               />
//               <div className="flex items-center">
//                 <div className="w-4 h-4 bg-black "></div>
//               </div>
//             </div>
//             <Image
//               src="/assets/animation.gif"
//               width={150}
//               height={200}
//               alt="eclipse-avatar"
//               unoptimized={true}
//             />
//             <div className="flex gap-2">
//               <Image
//                 src="/assets/Ellipse.svg"
//                 width={16}
//                 height={16}
//                 alt="eclipse-avatar"
//               />
//               <Image
//                 src="/assets/Polygon.svg"
//                 width={21}
//                 height={21}
//                 alt="eclipse-avatar"
//                 unoptimized={true}
//               />
//               <div className="flex items-center">
//                 <div className="w-4 h-4 bg-black"></div>
//               </div>
//             </div>
//           </section>
//           <p className="text-center">Generating QR code...</p>
//         </main>
//       </FullModal>
//     );
//   } else if (!showStatusScreen) {
//     const amount = Number(displayedTotal) / 10 ** 18;
//     const erc20Amount = Number(displayedTotal) / Math.pow(10, decimals);
//     const header = `${erc20Checkout ? erc20Amount : amount.toFixed(2)} ${symbol}`;
//     return (
//       <FullModal header={header} isOpen={isOpen} onClose={handleCloseQRScan}>
//         <QRScan
//           imgSrc={imgSrc}
//           totalToRender={header}
//           setStatusScreen={setStatusScreen}
//           totalDollar={totalDollar}
//           purchaseAddress={purchaseAddress}
//         />
//         {/* <WalletConnectQR
//           purchaseAddress={purchaseAddress}
//           displayedTotal={displayedTotal}
//         /> */}
//       </FullModal>
//     );
//   } else {
//     const statusIcon =
//       status == IStatus.Complete ? "Check.svg" : "empty-circle.svg";
//     return (
//       <FullModal isOpen={isOpen} onClose={onClose}>
//         <main className="mx-4 pt-under-nav">
//           <section className="mb-24">
//             <section>
//               <div className="flex justify-center">
//                 <Image
//                   src={`/assets/${statusIcon}`}
//                   width={86}
//                   height={86}
//                   alt="transaction-status-avatar"
//                 />
//               </div>
//               <div className="mb-8 mt-4">
//                 <h3 className="text-center">{status}</h3>
//                 {IStatus.Pending && (
//                   <p className="font-sans text-xs text-gray-500 text-center">
//                     May take up to 1 minute...
//                   </p>
//                 )}
//               </div>
//               <p className="font-sans">Transaction Details</p>
//               <section className="border-b border-gray-200 py-6">
//                 <p className="text-xs text-gray-500">Transaction Hash</p>
//                 <div className="flex justify-between mt-2" onClick={() => {}}>
//                   <p className="text-gray-700">Admin</p>
//                   <button>
//                     <Image
//                       src="/assets/copy-icon.svg"
//                       width={24}
//                       height={24}
//                       alt="eclipse-avatar"
//                     />
//                   </button>
//                 </div>
//               </section>
//               <section className="border-b border-gray-200 py-6">
//                 <p className="text-xs text-gray-500">Status</p>
//                 <p className="text-gray-700 mt-2">{status}</p>
//               </section>
//             </section>
//             <section className="border-b border-gray-200 py-6">
//               <p className="text-xs text-gray-500">Timestamp</p>
//               <div className="flex justify-between mt-2">
//                 <p className="text-gray-700">17395790</p>
//               </div>
//             </section>
//             <section className="border-b border-gray-200 py-6">
//               <p className="text-xs text-gray-500">From</p>
//               <div className="flex justify-between mt-2">
//                 <p className="text-gray-700">
//                   {"0X6c458595494768gjg83949tjsoqa".slice(0, 20)}...
//                 </p>
//                 <button>
//                   <Image
//                     src="/assets/copy-icon.svg"
//                     width={24}
//                     height={24}
//                     alt="eclipse-avatar"
//                   />
//                 </button>
//               </div>
//             </section>
//             <section className="border-b border-gray-200 py-6">
//               <p className="text-xs text-gray-500">To</p>
//               <div className="flex justify-between mt-2">
//                 <p className="text-gray-700">
//                   {purchaseAddress.slice(0, 20)}...
//                 </p>
//                 <button>
//                   <Image
//                     src="/assets/copy-icon.svg"
//                     width={24}
//                     height={24}
//                     alt="eclipse-avatar"
//                   />
//                 </button>
//               </div>
//             </section>
//           </section>
//         </main>
//       </FullModal>
//     );
//   }
// };

// export default TransactionStatus;
