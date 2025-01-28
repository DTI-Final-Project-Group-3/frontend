import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";

const Logo: FC = () => {
  return (
    <Link href="/" rel="preload">
      <Image
        alt="logo"
        height="50"
        width="200"
        src="/images/WareHub.svg"
        className="hidden md:block cursor-pointer w-full h-[25px]"
      />
    </Link>
  );
};

export default Logo;
