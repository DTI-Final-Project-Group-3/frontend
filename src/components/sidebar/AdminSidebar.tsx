import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";

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

const AdminSidebar: FC = () => {
  return (
    <nav className="flex flex-col min-w-[300px] border-r h-[calc(100vh-70px)] px-6 py-8">
      <ul className="flex flex-col items-start justify-center md:justify-end gap-2">
        {menuItems.map((item) => (
          <li
            key={item.title}
            className="hover:bg-slate-100 p-[10px] rounded-xl cursor-pointer flex gap-4 w-full"
          >
            <Link href={item.href}>
              <Image src={item.icon} alt={item.title} width={24} height={24} />
            </Link>
            <span>{item.title}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminSidebar;
