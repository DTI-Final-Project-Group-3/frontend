import React, { FC } from "react";
import Logo from "./components/Logo";
import MenuItems from "./components/MenuItems";

const Navbar: FC = () => {
  return (
    <header className="h-[70px] w-full sticky top-0 bg-white border-b-[1px] border-gray-100 z-10">
      <nav className="flex justify-between items-center h-full md:max-w-4xl lg:max-w-[1340px] mx-auto w-full px-6 lg:px-0">
        <Logo />
        <MenuItems />
      </nav>
    </header>
  );
};

export default Navbar;
