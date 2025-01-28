import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";

const menuItems = [
  { title: "Search", href: "/search", icon: "/icons/search.svg" },
  { title: "Cart", href: "/cart", icon: "/icons/cart.svg" },
  { title: "Profile", href: "/profile", icon: "/icons/user.svg" },
];

const MenuItems: FC = () => {
  return (
    <nav className="w-full p-4">
      <ul className="flex items-center justify-around md:justify-end gap-6">
        {menuItems.map((item) => (
          <li key={item.title}>
            <Link href={item.href}>
              <Image src={item.icon} alt={item.title} width={24} height={24} />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MenuItems;
