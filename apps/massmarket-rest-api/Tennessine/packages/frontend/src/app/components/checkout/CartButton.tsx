import React from "react";
import Image from "next/image";
import { useStoreContext } from "@/context/StoreContext";
import Link from "next/link";

const CartButton = () => {
  const { orderItems, orderId } = useStoreContext();

  const activeCartItems = orderId && orderItems.get(orderId)?.items;
  const arr = activeCartItems ? Object.values(activeCartItems) : [];
  let len = 0;
  for (const val of arr) {
    len += val;
  }
  return (
    <button>
      <div className="flex gap-3 border rounded-3xl bg-[#AED3FF] shadow-[0_5px_30px_3px_#AED3FF] px-2 py-1">
        <p className="text-sm">{len}</p>
        <Link href="/checkout">
          <Image
            src="/assets/cart.svg"
            alt="see-more-icon"
            width={15}
            height={15}
          />
        </Link>
      </div>
    </button>
  );
};

export default CartButton;
