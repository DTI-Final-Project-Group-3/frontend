"use client";

import { useCartStore } from "@/store/cartStore";
import React, { FC } from "react";
import CartItemLarge from "../cart/components/CartItemLarge";
import { cn } from "@/lib/utils";

type CartItemListsProps = {
  showButton?: boolean;
};

const CartItemLists: FC<CartItemListsProps> = ({ showButton = true }) => {
  const cartItems = useCartStore((state) => state.cartItems);

  return (
    <div
      className={cn(
        "flex flex-col gap-6 w-full",
        showButton ? "" : "bg-white rounded-xl"
      )}
    >
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div className="bg-white p-8 rounded-xl" key={item.id}>
            <CartItemLarge
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              quantity={item.quantity}
              stock={item.stock}
              showButton={showButton}
            />
          </div>
        ))
      ) : (
        <p className="bg-white px-8 py-10 rounded-xl text-center">
          Your cart is empty.
        </p>
      )}
    </div>
  );
};

export default CartItemLists;
