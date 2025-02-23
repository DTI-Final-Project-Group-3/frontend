"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import { signOut, useSession } from "next-auth/react";
import React, { FC } from "react";

const Header: FC = () => {
  const { data: session, status } = useSession();
  console.log(session);

  const getInitials = (role?: string): string => {
    if (!role) return "u";

    return role
      .split("_")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-white rounded-2xl p-4">
      <div className="flex items-center justify-end w-full">
        <HoverCard>
          <HoverCardTrigger>
            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 px-4 py-2">
              <Avatar>
                <AvatarImage
                  height={40}
                  width={40}
                  src={session?.user?.image || undefined}
                />
                <AvatarFallback>{getInitials(session?.role)}</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex md:flex-col gap-1">
                <h3 className="font-semibold text-lg">{session?.role}</h3>
                <p className="text-base text-slate-500">{status}</p>
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 p-5">
            <div className="flex flex-col gap-2 mb-4">
              <p>Logged in as </p>
              <div className="hidden md:flex md:flex-col gap-1">
                <h3 className="font-semibold text-lg">{session?.role}</h3>
                <p className="text-base text-slate-500">{status}</p>
              </div>
            </div>
            <Separator className="my-6"/>
            <Button
              onClick={() => signOut({ callbackUrl: "/login" })}
              variant={"destructive"}
              className="w-full"
            >
              Logout
            </Button>
          </HoverCardContent>
        </HoverCard>
      </div>
    </header>
  );
};

export default Header;
