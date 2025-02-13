import Cart from "@/components/cart/Cart";
import Navbar from "@/components/navbar/Navbar";
import SessionProviderWrapper from "@/components/session-provider/SessionProviderWrapper";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import TanstackQueryProvider from "@/providers/QueryClientProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Warehub",
  description:
    "Your one-stop warehouse shop, explore and purchase a wide range of products directly from our web app. Shop with ease and convenience!",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className={`${poppins.variable} antialiased font-inter`}>
        <TanstackQueryProvider>
          <SessionProviderWrapper>
            <Navbar />
            <Cart />
            <main>{children}</main>
            <Toaster />
          </SessionProviderWrapper>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
