"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";
import Logo from "./components/Logo";
import MenuItems from "./components/MenuItems";
import Search from "./components/Search";

const Navbar: FC = () => {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-[20] h-[120px] w-full border-b-[1px] border-gray-100 bg-white md:h-[70px]">
      <nav className="mx-auto flex h-full w-full flex-col items-center justify-between px-6 md:max-w-4xl md:flex-row lg:max-w-[1388px]">
        <div className="flex items-center justify-between w-full md:w-[70%]">
          <Logo />
          <Search />
        </div>

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
