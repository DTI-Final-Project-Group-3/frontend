"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import { signOut, useSession } from "next-auth/react";
import React, { FC } from "react";

const Header: FC = () => {
  const { data: session } = useSession();

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
            <div className="flex items-center gap-4 rounded-2xl bg-slate-50 px-4 py-2 cursor-pointer hover:shadow-sm">
              <Avatar>
                <AvatarImage
                  height={40}
                  width={40}
                  src={session?.userDetail?.profileImageUrl || undefined}
                />
                <AvatarFallback>{getInitials(session?.role)}</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex md:flex-col gap-1">
                <h3 className="font-semibold text-lg">
                  {session?.userDetail?.email}
                </h3>
                <p className="text-base text-slate-500">{session?.role}</p>
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 p-5">
            <div className="flex flex-col items-center gap-2 mb-4">
              <p className="text-sm text-gray-500 mb-3">Logged in as </p>
              <div className="hidden md:flex md:flex-col md:items-center gap-3">
                <Avatar>
                  <AvatarImage
                    height={40}
                    width={40}
                    src={session?.userDetail?.profileImageUrl || undefined}
                  />
                  <AvatarFallback>{getInitials(session?.role)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">
                  {session?.userDetail?.email}
                </h3>
                <p className="text-base text-slate-500">{session?.role}</p>
              </div>
            </div>
            <Separator className="my-6" />
            <Button
              onClick={() => signOut({ callbackUrl: "/login" })}
              variant={"outline"}
              className="w-full"
            >
              Sign out
            </Button>
          </HoverCardContent>
        </HoverCard>
      </div>
    </header>
  );
};

export default Header;
