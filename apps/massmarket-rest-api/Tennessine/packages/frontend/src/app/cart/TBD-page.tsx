// // SPDX-FileCopyrightText: 2024 Mass Labs
// //
// // SPDX-License-Identifier: GPL-3.0-or-later

// "use client";
// import React, { useState, useEffect } from "react";
// import ModalHeader from "@/app/common/components/ModalHeader";
// import Image from "next/image";
// import { useStoreContext } from "@/context/StoreContext";
// import { useRouter } from "next/navigation";
// import Button from "@/app/common/components/Button";
// import TransactionStatus from "@/app/components/transactions/TransactionStatus";
// import { ItemId } from "@/types";
// import ErrorMessage from "@/app/common/components/ErrorMessage";
// import PaymentOptions from "@/app/components/transactions/PaymentOptions";
// import { ItemState } from "@/context/types";

// const Cart = () => {
//   const {
//     orderItems,
//     updateOrder,
//     products,
//     commitOrder,
//     orderId,
//     finalizedOrders,
//   } = useStoreContext();
//   const cartIdsArr = Array.from([...orderItems.keys()]);
//   const router = useRouter();
//   const [openCheckoutFlow, setOpenModal] = useState<boolean>(false);
//   const [imgSrc, setSrc] = useState<null | string>(null);
//   const [checkoutReqId, setCheckoutRequestId] = useState<`0x${string}` | null>(
//     null,
//   );
//   const [showErrorMessage, setShowErrorMessage] = useState<null | string>(null);
//   const [showPaymentOptions, setShowPaymentOptions] = useState<boolean>(false);
//   const [erc20Checkout, setErc20Checkout] = useState<boolean>(false);
//   const [cryptoTotal, setCryptoTotal] = useState<string | null>(null);
//   const [purchaseAdd, setPurchaseAdd] = useState<string | null>(null);
//   const [totalDollar, setTotalDollar] = useState<string | null>(null);
//   const [activeCartItems, setActiveCartItems] = useState<ItemState | null>(
//     null,
//   );

//   let quantity: number = 0;
//   let totalPrice: number = 0;

//   useEffect(() => {
//     if (orderId) {
//       const items = orderItems.get(orderId)?.items || null;
//       setActiveCartItems(items);
//     }
//   }, [orderId, orderItems]);

//   const noItems =
//     !orderId || !activeCartItems || !Object.keys(activeCartItems).length;

//   useEffect((): void => {
//     if (finalizedOrders && checkoutReqId) {
//       const currentCart = finalizedOrders.get(checkoutReqId);
//       if (!currentCart) return;
//       const { totalInCrypto, erc20Addr, purchaseAddress, total } = currentCart;
//       setCryptoTotal(totalInCrypto);
//       setPurchaseAdd(purchaseAddress);
//       setTotalDollar(total);
//       if (erc20Checkout) {
//         setSrc(
//           `ethereum:${erc20Addr}/transfer?address=${purchaseAddress}&uint256=${totalInCrypto}`,
//         );
//       } else {
//         setSrc(`ethereum:${purchaseAddress}?value=${totalInCrypto}`);
//       }
//     }
//   }, [finalizedOrders, checkoutReqId]);

//   const checkout = async (isERC20Checkout: boolean) => {
//     setErc20Checkout(isERC20Checkout);
//     const res = await commitOrder(isERC20Checkout);
//     if (res.error) {
//       setShowPaymentOptions(false);
//       setOpenModal(false);
//       setShowErrorMessage(res.error);
//     } else if (res.orderFinalizedId) {
//       setCheckoutRequestId(res.orderFinalizedId);
//       setOpenModal(true);
//       setShowPaymentOptions(false);
//     }
//   };

//   const renderProducts = () => {
//     if (noItems) return <p className="text-center">you have no items</p>;
//     return Object.keys(activeCartItems).map((id) => {
//       const itemId = id as ItemId;
//       const item = products.get(itemId);
//       if (!item || !item.metadata.image) return;
//       const selectedQuantity = activeCartItems[itemId] || 0;
//       if (selectedQuantity && item.price) {
//         quantity += Number(selectedQuantity);
//         const qtyPrice = Number(item.price) * Number(selectedQuantity);
//         totalPrice += qtyPrice;
//       }

//       return (
//         <div key={item.metadata.title} className="flex my-4">
//           <div className="border p-1 rounded bg-white">
//             <Image
//               src={item.metadata.image}
//               width={64}
//               height={64}
//               alt="item-thumbnail"
//               unoptimized={true}
//             />
//           </div>
//           <div className="flex flex-col ml-4 mr-auto">
//             <p>{item.metadata.title}</p>
//             <p className="text-xs">{item.price}</p>
//             <p className="text-xs">QTY:{selectedQuantity}</p>
//             <p className="text-xs text-gray-400">{item.stockQty} Available</p>
//           </div>
//           <div className="flex justify-center">
//             <Image
//               src={"/assets/Trash.svg"}
//               width={24}
//               height={24}
//               alt="item-thumbnail"
//               unoptimized={true}
//               onClick={() => updateOrder(item.id, 0)}
//             />
//           </div>
//         </div>
//       );
//     });
//   };
//   return (
//     <main>
//       <PaymentOptions
//         isOpen={showPaymentOptions}
//         onClose={() => {
//           setShowPaymentOptions(false);
//         }}
//         checkout={checkout}
//       />
//       {purchaseAdd && (
//         <TransactionStatus
//           onClose={() => setOpenModal(false)}
//           isOpen={openCheckoutFlow}
//           imgSrc={imgSrc}
//           displayedTotal={cryptoTotal ? cryptoTotal : "0"}
//           erc20Checkout={erc20Checkout}
//           purchaseAddress={purchaseAdd}
//           totalDollar={totalDollar ? totalDollar : "0"}
//         />
//       )}
//       <section className="pt-under-nav h-screen bg-gray-100">
//         <ModalHeader
//           headerText="Review Sale"
//           goBack={() => {
//             router.push("/products");
//           }}
//         />
//         <ErrorMessage
//           errorMessage={showErrorMessage}
//           onClose={() => setShowErrorMessage(null)}
//         />
//         <section className="h-[45rem] flex flex-col">
//           <div className="mx-4">
//             <div className="flex justify-around	mt-4 mb-8">
//               <button
//                 disabled={!cartIdsArr.length}
//                 onClick={() => updateOrder()}
//                 className="py-2 px-4 text-pink-600 border-solid border-2 rounded-md disabled:bg-gray-200 disabled:text-gray-500 mr-2 w-full"
//               >
//                 Clear Cart
//               </button>
//               <button
//                 disabled={true}
//                 className="py-2 px-4 border-solid border-2 rounded-md disabled:bg-gray-200 disabled:text-gray-500 ml-2 w-full"
//               >
//                 Add Discount
//               </button>
//             </div>
//             {renderProducts()}
//           </div>
//           <div className="mt-auto bg-white p-4 pb-8 rounded-2xl border border-gray-200">
//             <div className="flex my-5">
//               <div className="flex flex-col mr-auto">
//                 <p>total</p>
//                 <p className="text-xs text-gray-500">{quantity} items</p>
//               </div>
//               <p>{totalPrice} USDC</p>
//             </div>
//             <div>
//               <Button
//                 onClick={() => router.push("/checkout")}
//                 disabled={noItems}
//               >
//                 <Image
//                   src={`/assets/${noItems ? "disabled-barcode.svg" : "Barcode.svg"}`}
//                   width={24}
//                   height={24}
//                   alt="barcode-icon"
//                   className="mr-2"
//                 />
//                 Checkout
//               </Button>
//             </div>
//           </div>
//         </section>
//       </section>
//     </main>
//   );
// };

// export default Cart;
