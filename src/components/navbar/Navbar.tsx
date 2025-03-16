"use client";

import React, { FC } from "react";
import Logo from "./components/Logo";
import MenuItems from "./components/MenuItems";
import { useSession } from "next-auth/react";
import Search from "./components/Search";
import Link from "next/link";

const Navbar: FC = () => {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-[20] h-[70px] w-full border-b-[1px] border-gray-100 bg-white">
      <nav className="mx-auto flex h-full w-full items-center justify-between px-6 md:max-w-4xl lg:max-w-[1388px]">
        <Logo />
        <Search />
        {!session ? (
          <div className="flex w-full flex-1 items-center justify-end">
            <Link
              href={"/login"}
              className="rounded-lg bg-warehub-green px-6 py-2 font-semibold text-white transition-all hover:bg-warehub-green-light"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <MenuItems />
        )}
      </nav>
    </header>
  );
};

export default Navbar;
