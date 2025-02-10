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
import React, { FC, useCallback, useEffect } from "react";
import { useSearchStore } from "@/store/searchStore";
import { useDebounce } from "@/hooks/useDebounce";

const menuItems = [
  {
    title: "Search",
    href: "/search",
    icon: "/icons/search.svg",
    tooltip: "Search",
  },
  {
    title: "Notification",
    href: "/notification",
    icon: "/icons/mail.svg",
    tooltip: "Notifications",
  },
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
  const { searchQuery, setSearchQuery, isSearchOpen, toggleSearch } =
    useSearchStore();

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <nav className="w-full">
      <ul className="flex items-center justify-around md:justify-end gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <li className="hover:bg-slate-100 p-[10px] rounded-xl cursor-pointer flex items-center">
                <div className="flex items-center">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={toggleSearch}
                  >
                    <Image
                      src="/icons/search.svg"
                      alt="Search"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isSearchOpen ? "w-[200px] ml-2" : "w-0"
                    }`}
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchInput}
                      placeholder="Search..."
                      className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </li>
            </TooltipTrigger>
          </Tooltip>

          {menuItems.slice(1).map((item) => (
            <Tooltip key={item.title}>
              <TooltipTrigger>
                <li className="hover:bg-slate-100 p-[10px] rounded-xl cursor-pointer">
                  <Link href={item.href}>
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={24}
                      height={24}
                    />
                  </Link>
                </li>
                <TooltipContent>{item.tooltip}</TooltipContent>
              </TooltipTrigger>
            </Tooltip>
          ))}

          <Tooltip>
            <TooltipTrigger asChild>
              <li
                className="hover:bg-slate-100 p-[10px] rounded-xl cursor-pointer relative"
                onClick={toggleShowCart}
              >
                <span className="absolute top-0 right-0 text-[14px] font-bold bg-red-500 px-2 text-white rounded-full border-white border-[1px]">
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
        </TooltipProvider>
      </ul>
    </nav>
  );
};

export default MenuItems;
