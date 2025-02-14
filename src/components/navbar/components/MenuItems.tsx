"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCartStore } from "@/store/cartStore";
import { useCartToggleStore } from "@/store/cartToggle";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import NotificationDropdown from "./NotificationDropdown";

const menuItems = [
  {
    title: "Profile",
    href: "/profile",
    icon: "/icons/user.svg",
    tooltip: "Profile",
  },
];

const MenuItems: FC = () => {
  const toggleShowCart = useCartToggleStore().toggleShowCart;
  const cartItems = useCartStore().cartItems;

  return (
    <nav className="w-full flex-1">
      <ul className="flex items-center justify-around md:justify-end gap-4">
        <TooltipProvider>
          {/* Cart Menu Icon */}
          <Tooltip>
            <TooltipTrigger asChild>
              <li
                className="hover:bg-slate-100 p-[10px] rounded-xl cursor-pointer relative"
                onClick={toggleShowCart}
              >
                <span className="absolute -top-1 -right-1 text-[14px] font-bold bg-red-500 px-2 text-white rounded-full border-white border-[1px]">
                  {cartItems.length < 1 ? "" : cartItems.length}
                </span>
                <Image
                  src="/icons/cart.svg"
                  alt="Cart"
                  width={24}
                  height={24}
                />
              </li>
            </TooltipTrigger>
            <TooltipContent>My Cart</TooltipContent>
          </Tooltip>

          {/* Notifications Menu Icon */}
          <NotificationDropdown />

          {/* Other Menu Icon */}
          {menuItems.map((item) => (
            <Tooltip key={item.title}>
              <TooltipTrigger>
                <Link href={item.href}>
                  <li className="hover:bg-slate-100 p-[10px] rounded-xl cursor-pointer">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={24}
                      height={24}
                    />
                  </li>
                </Link>
                <TooltipContent>{item.tooltip}</TooltipContent>
              </TooltipTrigger>
            </Tooltip>
          ))}
        </TooltipProvider>
      </ul>
    </nav>
  );
};

export default MenuItems;
