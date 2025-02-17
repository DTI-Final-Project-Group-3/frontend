import Cart from "@/components/cart/Cart";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Navbar />
      <Cart />
      <div>{children}</div>
      <Toaster />
      <Footer />
    </main>
  );
};

export default Layout;
