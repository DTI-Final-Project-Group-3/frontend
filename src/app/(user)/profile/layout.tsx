"use client";

import ProfileImage from "@/components/user/ProfileImage";
import { toast } from "@/hooks/use-toast";
import { useCartStore } from "@/store/cartStore";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

const reset_password_request_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/reset-password-request`;

export default function ProfileLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const resetCart = useCartStore((state) => state.resetCart);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [router, status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-[40px] px-6 min-h-[calc(100vh-70px)] w-full">
        Loading...
      </div>
    );
  }
  
  const resetPassword = async () => {
    if (session)
      try {
        setIsProcessing(true);
        const res = await fetch(reset_password_request_url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.accessToken}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          toast({title: "Success", description: "Check your email for password change link", duration: 2000,});
        } else {
          toast({title: "Failed", description: "Failed to send password change link", duration: 2000,});
        }
      } catch (error) {
        console.error("Error sending password change link:", error);
        toast({title: "Error", description: "Error sending password change link", duration: 2000,});
      } finally {
        setIsProcessing(false);
      }
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="py-[40px] px-6 min-h-[calc(100vh-70px)] bg-slate-100 w-full">
      <div className="md:max-w-4xl lg:max-w-[1340px] mx-auto w-full">
        <h1 className="text-2xl font-semibold">Welcome back,
          <span className="text-[#04B4FC  ]">{" " + session?.userDetail?.fullname}
            </span>
        </h1>

        <div className="mt-[40px] w-full flex flex-col md:flex-row md:gap-16 items-start">
          {/* Sidebar */}
          <div className="flex flex-col flex-shrink-0 items-center space-y-4 md:w-1/4 bg-white p-8 rounded-xl w-full">
            <ProfileImage/>

            <nav className="pt-10 w-full text-center space-y-2">
              <Link href="/profile/account" >
                <button
                  className={`block w-full py-2 px-4 my-1 rounded ${
                    pathname === "/profile/account"
                      ? "bg-gray-300"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Account
                </button>
              </Link>

              <Link href="/profile/address">
                <button
                  className={`block w-full py-2 px-4 my-1 rounded ${
                    pathname === "/profile/address"
                      ? "bg-gray-300"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Address
                </button>
              </Link>

              {session &&
                (session.role === "ADMIN_WAREHOUSE" ||
                  session.role === "ADMIN_SUPER") && (
                  <Link href={"/admin"}>
                    <button className="block w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600">
                      Admin
                    </button>
                  </Link>
                )}

              <button
                onClick={() => {
                  resetPassword();
                }}
                className="block w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isProcessing}
                >
                {isProcessing ? "Sending reset link" : "Reset Password"}
              </button>

              <button
                onClick={() => {resetCart();signOut({ callbackUrl: "/login" })}}
                className="block w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4 md:my-0 w-full my-20 bg-white p-12 rounded-xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
