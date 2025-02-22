"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { FC } from "react";

const Header: FC = () => {
  const { data: session, status } = useSession();
  console.log(session);

  return (
    <header className="bg-white rounded-2xl p-4">
      <div className="flex items-center justify-end w-full">
        <div className="flex items-center gap-4 rounded-2xl bg-slate-50 px-4 py-2">
          <Image
            src={session?.user?.image || "/images/no-image-icon.jpg"}
            alt="Profile Image"
            height={40}
            width={40}
            className="object-contain rounded-full"
          />
          <div className="hidden md:flex md:flex-col gap-1">
            <h3 className="font-semibold text-lg">{session?.role}</h3>
            <p className="text-base text-slate-500">{status}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
