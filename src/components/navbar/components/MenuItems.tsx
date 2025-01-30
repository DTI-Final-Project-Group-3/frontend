"use client";

import { useCartStore } from "@/store/cartStore";
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
  const toggleShowCart = useCartToggleStore().toggleShowCart;
  const cartItems = useCartStore().cartItems;

  return (
    <nav className="w-full">
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

        {/* Cart icon */}
        <li
          className="hover:bg-slate-100 p-[10px] rounded-xl cursor-pointer relative"
          onClick={toggleShowCart}
        >
          <span className="absolute top-0 right-0 text-[14px] font-bold bg-red-500 px-2 text-white rounded-full border-white border-[1px]">
            {cartItems.length < 1 ? "" : cartItems.length}
          </span>
          <Image src="/icons/cart.svg" alt="Cart" width={24} height={24} />
        </li>
      </ul>
    </nav>
  );
};

export default MenuItems;
