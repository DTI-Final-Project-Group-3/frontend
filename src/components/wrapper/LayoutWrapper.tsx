"use client";

import React, { FC, ReactNode } from "react";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { usePathname } from "next/navigation";
import { Toaster } from "../ui/toaster";
import Cart from "../cart/Cart";

type LayoutWrapperProps = {
  children: ReactNode;
};

const LayoutWrapper: FC<LayoutWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const hideNavbarAndFooter = pathname === "/login" || pathname === "/signup";

  return (
    <>
      {!hideNavbarAndFooter && <Navbar />}
      <Cart />
      <main>{children}</main>
      <Toaster />
      {!hideNavbarAndFooter && <Footer />}
    </>
  );
};

export default LayoutWrapper;
