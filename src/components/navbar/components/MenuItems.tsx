"use client";

import { useCartToggleStore } from "@/store/cartToggle";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";

const menuItems = [
  { title: "Search", href: "/search", icon: "/icons/search.svg" },
  { title: "Notification", href: "/notification", icon: "/icons/mail.svg" },
  { title: "Profile", href: "/profile", icon: "/icons/user.svg" },
];

const MenuItems: FC = () => {
  const showCart = useCartToggleStore.getState().showCart;
  console.log(showCart);
  const toggleShowCart = useCartToggleStore().toggleShowCart;

  return (
    <nav className="w-full p-4">
      <ul className="flex items-center justify-around md:justify-end gap-2">
        {menuItems.map((item) => (
          <li
            key={item.title}
            className="hover:bg-slate-100 p-[10px] rounded-xl cursor-pointer"
          >
            <Link href={item.href}>
              <Image src={item.icon} alt={item.title} width={24} height={24} />
            </Link>
          </li>
        ))}
        {/* Cart item with toggle functionality */}
        <li
          className="hover:bg-slate-100 p-[10px] rounded-xl cursor-pointer"
          onClick={toggleShowCart}
        >
          <Image src="/icons/cart.svg" alt="Cart" width={24} height={24} />
        </li>
      </ul>
    </nav>
  );
};

export default MenuItems;
