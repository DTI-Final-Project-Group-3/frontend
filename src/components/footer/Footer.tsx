import React, { FC } from "react";
import Logo from "../navbar/components/Logo";

const Footer: FC = () => {
  return (
    <footer className="w-full bg-slate-50 px-6">
      <div className="flex flex-col gap-6 items-center md:max-w-4xl lg:max-w-[1340px] mx-auto w-full py-12 text-slate-500 font-light">
        <Logo />
        <div className="flex items-center gap-6 text mt-4 justify-between w-full">
          <span>&#169; 2025 Warehub. All rights reserved</span>
          <div className="hidden lg:flex gap-4">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
