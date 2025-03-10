"use client";

import { toast } from "@/hooks/use-toast";
import { formatSpringBootError } from "@/types/models/springBootErrorResponse";
import { Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const admin_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_ADMIN}`;

const CreateAdminPage = () => {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { data: session, status } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      return;
    }

    try {

      if (password.length <8) {
        toast({ title: "Failed", description: "Password length minimum is 8", duration: 2000});
        return;
      }

      const res = await fetch(admin_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          fullname,
          email,
          password,
        }),
      });
      const data = await res.json();

      console.log("Signup response:", data);

      if (data.success) {
        router.push("/admin/account-management");
      } else {
        console.log("Signup failed:");
        toast({title: "Failed", description: "Signup failed : " + formatSpringBootError(data), duration: 2000,});
      }
    } catch (error) {
      console.error("Signup error", error);
      toast({title: "Error", description: "Signup error", duration: 2000,});
    }
  };

  if (status === "loading") {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <section className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center mb-6">Create Warehouse Admin</h2>

      <form onSubmit={handleSubmit}>
        <div className="mt-6">
          <input
            type="text"
            placeholder="Your full name"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mt-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
        >
          Create Account
        </button>

        <Link href="/admin/account-management">
            <button className="mt-6 w-full bg-red-600 text-white p-3 rounded-md hover:bg-red-700 transition">
                Cancel
            </button>
        </Link>
      </form>
    </section>
  );
};

export default CreateAdminPage;
