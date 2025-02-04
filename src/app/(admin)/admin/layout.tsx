import type { Metadata } from "next";
import "../../globals.css";
import { Toaster } from "@/components/ui/toaster";
import AdminSidebar from "@/components/sidebar/AdminSidebar";

export const metadata: Metadata = {
  title: "Warehub - Admin",
  description: "Manage the admins, products, orders, etc.",
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

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-[calc(100vh-70px)]">
      <AdminSidebar />
      <div className="w-full flex flex-col p-6">{children}</div>
      <Toaster />
    </div>
  );
}
