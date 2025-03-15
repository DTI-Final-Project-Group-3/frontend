"use client";

import React, { FC, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { menuItems } from "@/constant/adminMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent } from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import { signOut, useSession } from "next-auth/react";

const Sidebar: FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getInitials = (role?: string): string => {
    if (!role) return "u";

    return role
      .split("_")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <>
      {/* Mobile header with hamburger button */}
      <div className="fixed left-0 top-0 z-[100] flex w-full items-center justify-between bg-white p-4 shadow-md md:hidden">
        <Image
          src="/images/WareHub.svg"
          alt="Logo"
          height={40}
          width={120}
          className="h-auto w-auto"
        />
        <div className="flex items-center gap-3">
          <HoverCard>
            <HoverCardTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  height={40}
                  width={40}
                  src={session?.userDetail?.profileImageUrl || undefined}
                />
                <AvatarFallback>{getInitials(session?.role)}</AvatarFallback>
              </Avatar>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-5">
              <div className="mb-4 flex flex-col items-center gap-2">
                <p className="mb-3 text-sm text-gray-500">Logged in as </p>
                <div className="flex flex-col items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      height={40}
                      width={40}
                      src={session?.userDetail?.profileImageUrl || undefined}
                    />
                    <AvatarFallback>
                      {getInitials(session?.role)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">
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
          <button
            onClick={toggleMobileMenu}
            className="flex flex-col items-center justify-center space-y-1.5 rounded p-2 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-6 bg-black transition-transform ${isMobileMenuOpen ? "translate-y-2 rotate-45" : ""}`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-black transition-opacity ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`}
            ></span>
            <span
              className={`block h-0.5 w-6 bg-black transition-transform ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            ></span>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[90] bg-black bg-opacity-50 transition-opacity md:hidden ${
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={toggleMobileMenu}
      ></div>

      {/* Desktop sidebar */}
      <div className="sticky left-0 top-0 z-[45] hidden h-screen flex-col justify-between bg-white px-5 pb-5 pt-10 md:flex">
        <div>
          <div className="flex flex-row items-center gap-2 border-b border-dashed border-gray-300 pb-10">
            <Image
              src="/images/WareHub.svg"
              alt="Logo"
              height={50}
              width={140}
              className="h-auto w-auto"
            />
          </div>

          <div className="mt-10 flex flex-col gap-5">
            {menuItems.map((link) => {
              const isSelected =
                (link.route !== "/admin" &&
                  pathname.includes(link.route) &&
                  link.route.length > 1) ||
                pathname === link.route;

              return (
                <Link href={link.route} key={link.route}>
                  <div
                    className={cn(
                      "flex w-full flex-row items-center gap-4 rounded-lg px-5 py-3",
                      isSelected && "bg-[#62AA62] shadow-sm",
                    )}
                  >
                    <div className="relative size-5">
                      <Image
                        src={link.icon}
                        alt={link.title}
                        fill
                        className={cn(
                          "object-contain",
                          isSelected ? "brightness-0 invert" : "",
                        )}
                      />
                    </div>
                    <p
                      className={cn(
                        "text-base font-medium",
                        isSelected ? "text-white" : "text-black",
                      )}
                    >
                      {link.title}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Profile section at bottom of sidebar */}
        <div className="mt-auto border-t border-dashed border-gray-300 pt-5">
          <HoverCard>
            <HoverCardTrigger>
              <div className="flex cursor-pointer items-center gap-4 rounded-lg px-3 py-2 hover:bg-slate-50">
                <Avatar>
                  <AvatarImage
                    height={40}
                    width={40}
                    src={session?.userDetail?.profileImageUrl || undefined}
                  />
                  <AvatarFallback>{getInitials(session?.role)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="max-w-32 truncate text-sm font-medium">
                    {session?.userDetail?.email}
                  </p>
                  <p className="text-xs text-slate-500">{session?.role}</p>
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-5">
              <div className="mb-4 flex flex-col items-center gap-2">
                <p className="mb-3 text-sm text-gray-500">Logged in as </p>
                <div className="flex flex-col items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      height={40}
                      width={40}
                      src={session?.userDetail?.profileImageUrl || undefined}
                    />
                    <AvatarFallback>
                      {getInitials(session?.role)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">
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
      </div>

      {/* Mobile menu - completely separate from desktop sidebar */}
      <div
        className={`fixed left-0 top-0 z-[95] flex h-screen w-64 flex-col bg-white px-5 pb-5 pt-20 shadow-xl transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex w-full flex-col gap-5">
          {menuItems.map((link) => {
            const isSelected =
              (link.route !== "/admin" &&
                pathname.includes(link.route) &&
                link.route.length > 1) ||
              pathname === link.route;

            return (
              <Link
                href={link.route}
                key={link.route}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div
                  className={cn(
                    "flex w-full flex-row items-center gap-4 rounded-lg px-5 py-3",
                    isSelected && "bg-[#62AA62] shadow-sm",
                  )}
                >
                  <div className="relative size-5">
                    <Image
                      src={link.icon}
                      alt={link.title}
                      fill
                      className={cn(
                        "object-contain",
                        isSelected ? "brightness-0 invert" : "",
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      "text-base font-medium",
                      isSelected ? "text-white" : "text-black",
                    )}
                  >
                    {link.title}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Profile section at bottom of mobile menu */}
        <div className="mt-auto border-t border-dashed border-gray-300 pt-5">
          <div className="flex items-center gap-4 rounded-lg px-3 py-2">
            <Avatar>
              <AvatarImage
                height={40}
                width={40}
                src={session?.userDetail?.profileImageUrl || undefined}
              />
              <AvatarFallback>{getInitials(session?.role)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="max-w-32 truncate text-sm font-medium">
                {session?.userDetail?.email}
              </p>
              <p className="text-xs text-slate-500">{session?.role}</p>
            </div>
          </div>
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            variant={"outline"}
            className="mt-4 w-full"
          >
            Sign out
          </Button>
        </div>
      </div>

      {/* Content padding for mobile header */}
      <div className="h-16 md:hidden"></div>
    </>
  );
};

export default Sidebar;
