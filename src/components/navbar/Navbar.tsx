"use client";

import React, { FC } from "react";
import Logo from "./components/Logo";
import MenuItems from "./components/MenuItems";
import { useSession } from "next-auth/react";
import Search from "./components/Search";
import { Button } from "../ui/button";
import Link from "next/link";

const Navbar: FC = () => {
  const { data: session } = useSession();

  return (
    <header className="h-[70px] w-full sticky top-0 bg-white border-b-[1px] border-gray-100 z-10">
      <nav className="flex justify-between items-center h-full md:max-w-4xl lg:max-w-[1388px] mx-auto w-full px-6 ">
        <Logo />
        <Search />
        {!session ? (
          <Button
            variant="link"
            className="flex-1 flex items-end justify-end"
            asChild
          >
            <Link href={"/login"}>Login</Link>
          </Button>
        ) : (
          <MenuItems />
        )}
      </nav>
    </header>
  );
};

export default Navbar;
