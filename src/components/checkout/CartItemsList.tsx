import React, { FC } from "react";
import CartItemLarge from "../cart/components/CartItemLarge";
import { WarehouseInventorySummary } from "@/types/models/warehouseInventories";
import { CartItem } from "@/store/cartStore";

type CartItemsListProps = {
  cartItems: CartItem[];
};

const CartItemsList: FC<CartItemsListProps> = ({ cartItems }) => {
  return (
    <div className="bg-white rounded-xl">
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div className="p-8" key={item.inventoryId}>
            <CartItemLarge
              id={item.inventoryId}
              name={item.product.name}
              price={item.product.price}
              stock={item.stockQuantity}
              quantity={item.cartQuantity}
              imageUrl={item.product.thumbnail}
              showButton={true}
              category={item.product.category.name}
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

export default CartItemsList;
