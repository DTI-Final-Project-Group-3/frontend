import React, { FC } from "react";
import Logo from "./components/Logo";
import MenuItems from "./components/MenuItems";

const Navbar: FC = () => {
  return (
    <header className="h-[70px] w-full sticky top-0 bg-white border-b-[1px]">
      <nav className="flex justify-between items-center h-full max-w-7xl mx-auto w-full">
        <Logo />
        <MenuItems />
      </nav>
    </header>
  );
};

export default Navbar;
