import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="w-full bg-slate-50 p-8 border border-slate-100">
      <div className="flex flex-col gap-6 items-center md:max-w-4xl lg:max-w-[1340px] mx-auto w-full py-12 text-black font-light">
        <div className="flex md:flex-row flex-col-reverse items-center gap-6 text mt-4 justify-between w-full">
          <span className="font-normal">&#169; 2025 Warehub. All rights reserved</span>
          <div className="flex gap-4 text-base">
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
