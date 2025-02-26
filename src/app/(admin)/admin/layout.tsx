import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/admin/sidebar/Sidebar";
import "../../globals.css";
import { ReactNode } from "react";
import Header from "@/components/admin/header/Header";

export const metadata: Metadata = {
  title: "Warehub - Admin",
  description:
    "Manage the admins, warehouses, products, inventories, orders, etc.",
  icons: {
    icon: [
      {
        rel: "icon",
        type: "image/svg",
        sizes: "42x42",
        url: "/favicon.svg",
      },
    ],
  },
};

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex w-full min-h-screen">
      <Sidebar />
      <div className="w-full flex flex-col gap-6 p-6 bg-slate-100">
        {/* <Header /> */}
        {children}
      </div>
      <Toaster />
    </main>
  );
};

export default AdminLayout;
