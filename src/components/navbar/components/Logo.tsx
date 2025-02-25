import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";

const Logo: FC = () => {
  return (
    <Link
      href="/"
      rel="preload"
      className="flex items-start justify-start flex-1 w-full"
    >
      <Image
        alt="logo"
        src="/images/WareHub.svg"
        height={50}
        width={200}
        className="cursor-pointer h-auto"
      />
    </Link>
  );
};

export default Logo;
