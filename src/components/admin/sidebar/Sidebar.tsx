"use client";

import React, { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { menuItems } from "@/constant/adminMenu";

const Sidebar: FC = () => {
  const pathname = usePathname();

  return (
    <div className="sticky left-0 top-0 flex h-screen flex-col justify-between bg-white px-5 pb-5 pt-10">
      <div>
        <div className="flex flex-row items-center gap-2 border-b border-dashed border-gray-300 pb-10 max-md:justify-center">
          <Image
            src="/images/WareHub.svg"
            alt="Logo"
            height={50}
            width={140}
            className="w-auto h-auto"
          />
        </div>

        <div className="mt-10 flex flex-col gap-5">
          {menuItems.map((link) => {
            const isSelected =
              (link.route !== "/admin" &&
                pathname.includes(link.route) &&
                link.route.length > 1) ||
              pathname === link.route;

            return (
              <Link href={link.route} key={link.route}>
                <div
                  className={cn(
                    "flex flex-row items-center w-full gap-4 rounded-lg px-5 py-3 max-md:justify-center",
                    isSelected && "bg-[#62AA62] shadow-sm"
                  )}
                >
                  <div className="relative size-5">
                    <Image
                      src={link.icon}
                      alt={link.title}
                      fill
                      className={cn(
                        "object-contain",
                        isSelected ? "brightness-0 invert" : ""
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      "text-base font-medium max-md:hidden",
                      isSelected ? "text-white" : "text-black"
                    )}
                  >
                    {link.title}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
